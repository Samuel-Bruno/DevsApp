import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocFromServer, getDocsFromServer, getFirestore, onSnapshot, query, setDoc, Timestamp, updateDoc, where, } from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  updatePassword,
  UserCredential,
} from 'firebase/auth'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { v4 as createId } from 'uuid'

import app, { storage } from '../fb'

import { getUserObj } from './helpers/login'

import { Chat, LoginRes } from '../types/api/loginRes'
import { useDispatch } from 'react-redux'
import { ChatData } from '../types/api/getChat'
import { GetChatsRes } from '../types/api/getChatsRes'
import { Message } from '../types/chat/messages'
import { SendMessageProps } from '../types/api/sendMessage'
import { SignUpProps, SignUpRes } from '../types/api/signUp'
import { AddChatRes } from '../types/api/addChat'
import { Photo } from '../types/api/photo'
import UserInFirestore from '../types/fb-firestore/user'

import { case1, case2, case3 } from './helpers/updateUser'
import { GetUserInfoRes } from '../types/api/getUserInfo'


const db = getFirestore(app)

const useApi = () => {

  const Auth = getAuth()
  const chatsRef = collection(db, 'chats')
  const usersRef = collection(db, 'users')

  const dispatch = useDispatch()


  return {
    signup: async ({ name, email, password }: SignUpProps) => {
      let res: SignUpRes = { success: true }

      await createUserWithEmailAndPassword(getAuth(), email, password)
        .then(async cred => {
          const token = await cred.user.getIdToken()

          const userObj = {
            avatar: await getDownloadURL(ref(storage, `profilesPhotos/default_user.jpg`)),
            chats: [],
            email: cred.user.email,
            name: name
          }

          await setDoc(doc(db, "users", cred.user.uid), userObj)

          res.user = {
            avatar: userObj.avatar,
            chats: userObj.chats,
            email: userObj.email as string,
            name: userObj.name,
            token: token,
            id: cred.user.uid,
            photoUrl: cred.user.photoURL,
          };
        })
        .catch(error => {
          res.success = false
          res.error = {
            code: error.code,
            message: error.message
          }
        });

      return res
    },
    login: async (email: string, password: string) => {
      let res: LoginRes = { success: true }

      await signInWithEmailAndPassword(Auth, email, password)
        .then(async (cred: UserCredential) => {
          const userDoc = await getDocFromServer(doc(usersRef, cred.user.uid))
          res.user = await getUserObj(cred, userDoc.data() as UserInFirestore)
        })
        .catch(error => {
          res = { success: false, error }
        })

      return res
    },

    addChat: async (userId: string, userAvatar: string, userName: string, emailTo: string) => {
      let res: AddChatRes = { success: true }

      let userWithEmailTo = await getDocsFromServer(
        query(usersRef, where('email', '==', emailTo))
      )
      if (!userWithEmailTo.empty) {
        const otherUser = userWithEmailTo.docs[0]
        let chatAlreadyExists = false

        const userDoc = await getDocFromServer(doc(usersRef, userId))
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserInFirestore
          const userChats = await getDocsFromServer(
            query(chatsRef, where('users', 'array-contains', userId))
          )

          userChats.docs.forEach(c => {
            if (!chatAlreadyExists) {
              let users = c.get('users') as string[]
              if (users.includes(otherUser.id)) chatAlreadyExists = true
            }
          })

          if (chatAlreadyExists) {
            res = {
              success: false,
              error: { code: 'chat/already-exists', message: 'Você já tem um chat com este usuário' }
            }
          } else {
            let add = await addDoc(chatsRef, {
              messages: [],
              users: [userId, otherUser.id]
            })


            let pUrl = await getDownloadURL(ref(storage, `profilesPhotos/${otherUser.get('avatar')}`))
            const newChatForUserObj: Chat = {
              chatId: add.id,
              chatLastMsg: '',
              lastMessageDate: Timestamp.now(),
              chatName: otherUser.get('name') as string,
              photoUrl: pUrl,
              chatLastMsgType: 'fm'
            }
            updateDoc(doc(usersRef, userId), { chats: arrayUnion(newChatForUserObj) })
            updateDoc(doc(usersRef, otherUser.id), {
              chats: arrayUnion({
                chatId: add.id,
                chatLastMsg: '',
                lastMessageDate: Timestamp.now(),
                chatName: userName,
                photoUrl: await getDownloadURL(ref(storage, `profilesPhotos/${userData.avatar}`)),
                chatLastMsgType: 'fm'
              })
            })

            res.userChatsList = [...userData.chats, newChatForUserObj]

            const chatDoc = await getDocFromServer(add)
            const chatDocData = chatDoc.data() as ChatData
            res.chatDoc = {
              messages: chatDocData.messages,
              users: chatDocData.users,
              id: chatDoc.id,
              ref: chatDoc.ref.path
            }
          }
        }


      } else {
        res = {
          success: false,
          error: { code: 'user/not-found', message: 'Usuário não encontrado' }
        }
      }

      return res
    },
    getUserChats: async (userId: string) => {
      let res: GetChatsRes = { success: true, chats: [] }

      const q = query(chatsRef, where("users", "array-contains", userId))
      const chatsDocs = await getDocsFromServer(q)

      if (!chatsDocs.empty) {
        chatsDocs.docs.forEach(c => {
          res.chats.push({
            id: c.id,
            ref: c.ref.path,
            users: c.get('users'),
            messages: c.get('messages')
          })
        })

        onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              dispatch({
                type: 'UPDATE_CHAT',
                payload: { chatData: change.doc.data(), chatId: change.doc.id }
              })
            }
          })
        })
      }

      return res
    },
    getUserInfo: async (userId: string, token: string) => {
      let res: GetUserInfoRes = { success: false }
      const uRef = doc(usersRef, userId)
      const userDoc = (await getDocFromServer(uRef))
      if (userDoc.exists()) {
        res.success = true
        const userData = userDoc.data() as UserInFirestore
        res.data = {
          avatar: await getDownloadURL(ref(storage, `profilesPhotos/${userData.avatar}`)),
          chats: userData.chats,
          email: userData.email,
          id: uRef.id,
          name: userData.name,
          photoUrl: null,
          token
        }
      }
      return res
    },
    delChat: async (chatId: string, userId: string) => {
      const uRef = doc(usersRef, userId)
      const uDoc = await getDocFromServer(uRef)
      const cDoc = await getDocFromServer(doc(chatsRef, chatId))
      const otherUserDoc = await getDocFromServer((doc(
        usersRef, cDoc.get('users').filter((u: string) => u !== userId)[0]
      )))

      updateDoc(uRef, { chats: uDoc.get('chats').filter((c: Chat) => c.chatId !== chatId) })
      if ((otherUserDoc.get('chats') as Chat[]).findIndex(c => c.chatId === chatId) === -1) {
        deleteDoc(doc(chatsRef, chatId))
      }
    },
    sendMessage: async (props: SendMessageProps) => {
      let { msgType, msgBody, chat, userId } = props

      const msgObj: Message = {
        body: msgBody,
        date: Timestamp.now(),
        from: userId,
        to: chat.users.filter(u => u !== userId)[0],
        type: msgType
      }

      await updateDoc(doc(chatsRef, chat.id), { messages: arrayUnion(msgObj) })
      const userDoc = (await getDocFromServer(doc(usersRef, userId))).data() as UserInFirestore
      const otherUser = (await getDocFromServer(doc(usersRef, msgObj.to))).data() as UserInFirestore

      let userModifiedChat: Chat = {
        ...userDoc.chats.find(c => c.chatId === chat.id) as Chat,
        chatLastMsg: msgObj.body,
        chatLastMsgType: msgObj.type,
        lastMessageDate: msgObj.date,
      }
      let otherUserModifiedChat: Chat = {
        ...otherUser.chats.find(c => c.chatId === chat.id) as Chat,
        chatLastMsg: msgObj.body,
        chatLastMsgType: msgObj.type,
        lastMessageDate: msgObj.date,
      }

      await updateDoc(doc(usersRef, userId), {
        chats: [userModifiedChat, ...userDoc.chats.filter(c => c.chatId !== chat.id)]
      })
      await updateDoc(doc(usersRef, msgObj.to), {
        chats: [otherUserModifiedChat, ...otherUser.chats.filter((c: Chat) => c.chatId !== chat.id)]
      })
    },
    uploadPhoto: async (file: File) => {
      if (['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        let hashName = ref(storage, `images/${createId()}`)

        let upload = await uploadBytes(hashName, file)
        let photoUrl = await getDownloadURL(upload.ref)

        return { name: upload.ref.name, url: photoUrl } as Photo
      } else {
        return new Error('Tipo de arquivo não permitido')
      }
    },
    updateUser: async (userId: string, name?: string, avatar?: File) => {
      const c1 = !name && avatar !== undefined
      const c2 = name && name !== '' && !avatar
      const c3 = name && name !== '' && avatar !== undefined

      const userRef = doc(usersRef, userId)
      const userProfileNameRef = await (await getDocFromServer(userRef)).get('avatar')

      if (c1) case1({
        userId, avatar,
        oldPhotoRef: userProfileNameRef,
        dispatch, userRef,
        usersRef: usersRef, chatsRef: chatsRef
      })
      if (c2) case2({
        userId, name, dispatch,
        userRef, usersRef, chatsRef
      })
      if (c3) case3({
        userId, name, avatar,
        oldPhotoRef: userProfileNameRef,
        dispatch, userRef, usersRef, chatsRef
      })
    },


    saveToken: (token: string) => {
      localStorage.setItem('token', token)
    },
    getSavedToken: () => {
      return localStorage.getItem('token')
    },
    updatePassword: async (newPassword: string) => {
      if (Auth.currentUser) await updatePassword(Auth.currentUser, newPassword)
    },

    logout: async () => {
      localStorage.removeItem('token')
      await signOut(getAuth())
      dispatch({ type: 'CLEAN_USER_STATE', payload: { clean: true } })
      dispatch({ type: 'CLEAN_CHAT_STATE', payload: { clean: true } })
    }
  }

}


export default useApi