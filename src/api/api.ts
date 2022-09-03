import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocFromServer, getDocsFromServer, getFirestore, onSnapshot, query, setDoc, Timestamp, updateDoc, where, } from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  updatePassword,
  UserCredential,
} from 'firebase/auth'
import { ref, getDownloadURL, uploadBytes, deleteObject, UploadResult } from 'firebase/storage'
import { v4 as createId } from 'uuid'

import app, { storage } from '../fb'

import { parseChatsList, getUserObj, userOnSnap } from './helpers/login'

import { Chat, LoginRes } from '../types/api/loginRes'
import { useDispatch } from 'react-redux'
import { ChatData, GetChatRes } from '../types/api/getChat'
import { GetChatsRes } from '../types/api/getChatsRes'
import { Message } from '../types/chat/messages'
import { ChatInfo } from '../types/reducers/chatsReducer'
import { SendMessageProps } from '../types/api/sendMessage'
import { SignUpProps, SignUpRes } from '../types/api/signUp'
import { AddChatRes, OtherUser } from '../types/api/addChat'
import { UserChatList } from '../types/chat/UserChatList'
import { Photo } from '../types/api/photo'
import UserInFirestore from '../types/fb-firestore/user'


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
          if (userDoc.exists()) {
            res.user = await getUserObj(cred, userDoc.data() as UserInFirestore)
            // onSnapShot
          } else {
            res = {
              success: false,
              error: { code: 'login/user-dont-exists', message: '' }
            }
          }
        })
        .catch(error => {
          res = { success: false, error: { message: error.message, code: error.code } }
        })

      return res
    },

    addChat: async (userId: string, userAvatar: string, userName: string, emailTo: string) => {
      let res: AddChatRes = { success: true }

      // 1. verify if exists a user w/ emailTo
      let userWithEmailTo = await getDocsFromServer(
        query(usersRef, where('email', '==', emailTo))
      )
      if (!userWithEmailTo.empty) {
        const otherUser = userWithEmailTo.docs[0]
        let chatAlreadyExists = false

        // 1.2. if exists verify if user already have a chat w emailTo
        const userDoc = await getDocFromServer(doc(usersRef, userId))
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserInFirestore
          const userChats = await getDocsFromServer(
            query(usersRef, where('users', 'array-contains', userId))
          )

          userData.chats.forEach(c => {
            let chat = userChats.docs.find(ct => ct.get('users').includes(userWithEmailTo.docs[0].id))
            if (chat !== undefined) chatAlreadyExists = true
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

            // 2022-09-02 -> decided to use link

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
      let res: GetChatsRes = { success: false, chats: [], chatsDocs: [] }

      const q = query(chatsRef, where("users", "array-contains", userId))
      const chatsDocs = await getDocsFromServer(q)

      if (!chatsDocs.empty) {
        res.success = true
        chatsDocs.docs.forEach(c => {
          res.chats.push({
            id: c.id,
            ref: c.ref.path,
            users: c.get('users'),
            messages: c.get('messages')
          })
        })
        // res.chatsDocs = chatsDocs.docChanges()

        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            console.log(change.type)
            if (change.type === "added") {
              console.log("onSnapshot - added")
            }
            if (change.type === "modified") {
              dispatch({
                type: 'UPDATE_CHAT',
                payload: { chatData: change.doc.data(), chatId: change.doc.id }
              })
            }
            if (change.type === "removed") {
              console.log("onSnapshot - removed")
            }
          })
        })
        // chatsDocs.docChanges()
        //   .forEach(async snapshot => {
        //     console.log(snapshot)
        //     if (snapshot.type === 'added') {
        //       dispatch({
        //         type: 'UPDATE_CHAT',
        //         payload: { chatData: snapshot.doc.data(), chatId: snapshot.doc.id }
        //       })
        //     }
        //   })
      }

      return res
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
      const case1 = name && name !== '' && avatar !== undefined
      const case2 = name && name !== '' && !avatar
      const case3 = !name && avatar !== undefined

      const userRef = doc(usersRef, userId)
      const userProfileNameRef = await (await getDocFromServer(userRef)).get('avatar')

      const imagesTypesAllowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

      if (case1) {
        let upload: UploadResult
        let photoUrl = ''

        if (imagesTypesAllowed.includes(avatar.type)) {
          let hashName = ref(storage, `profilesPhotos/${createId()}`)
          upload = await uploadBytes(hashName, avatar)
          photoUrl = upload.ref.name
        }

        await deleteObject(ref(storage, `profilesPhotos/${userProfileNameRef}`))
        await updateDoc(userRef, { name: name, avatar: photoUrl })

        const q = query(chatsRef, where("users", "array-contains", userId))
        const chatsUserIn = await getDocsFromServer(q)

        chatsUserIn.docs.forEach((chat => {
          const usersChattingWith: string[] = chat.data().users
            .filter((id: string) => id !== userId)

          usersChattingWith.forEach(async otherUser => {
            const uRef = doc(usersRef, otherUser)
            const otherUserData = await getDocFromServer(uRef)
            if (otherUserData.exists()) {
              const otherUserChats: UserChatList[] = otherUserData.data().chats
              const chatToChange = otherUserChats.findIndex((c) => c.chatId === chat.id)

              otherUserChats[chatToChange].chatName = name
              otherUserChats[chatToChange].photoUrl = photoUrl

              dispatch({
                type: 'UPDATE_USER_PHOTO',
                photoUrl: await getDownloadURL(upload.ref)
              })

              const updatedChats = otherUserChats
              await updateDoc(uRef, {
                chats: updatedChats
              })
            }
          })
        }))

        const pastPhotoRef = ref(storage, Auth.currentUser?.photoURL as string)
        deleteObject(pastPhotoRef)
      }
      if (case2) {
        await updateDoc(userRef, { name: name })
        const q = query(chatsRef, where("users", "array-contains", userId))
        const chatsUserIn = await getDocsFromServer(q)

        chatsUserIn.docs.forEach((chat => {
          const usersChattingWith: string[] = chat.data().users.filter(
            (id: string) => id !== userId
          )
          usersChattingWith.forEach(async otherUser => {
            const uRef = doc(usersRef, otherUser)
            const otherUserData = await getDocFromServer(uRef)
            if (otherUserData.exists()) {
              const otherUserChats: UserChatList[] = otherUserData.data().chats
              const chatToChange = otherUserChats.findIndex((c) => c.chatId === chat.id)

              otherUserChats[chatToChange].chatName = name

              const updatedChats = otherUserChats
              await updateDoc(uRef, {
                chats: updatedChats
              })
            }
          })
        }))
      }
      if (case3) {
        let upload: UploadResult
        let photoUrl = ''

        if (imagesTypesAllowed.includes(avatar.type)) {
          let hashName = ref(storage, `profilesPhotos/${createId()}`)
          upload = await uploadBytes(hashName, avatar)
          photoUrl = upload.ref.name
        }

        await deleteObject(ref(storage, `profilesPhotos/${userProfileNameRef}`))
        await updateDoc(userRef, { avatar: photoUrl })

        const q = query(chatsRef, where("users", "array-contains", userId))
        const chatsUserIn = await getDocsFromServer(q)

        chatsUserIn.docs.forEach((chat => {
          const usersChattingWith: string[] = chat.data().users
            .filter((id: string) => id !== userId)

          usersChattingWith.forEach(async otherUser => {
            const uRef = doc(usersRef, otherUser)
            const otherUserData = await getDocFromServer(uRef)
            if (otherUserData.exists()) {
              const otherUserChats: UserChatList[] = otherUserData.data().chats
              const chatToChange = otherUserChats.findIndex((c) => c.chatId === chat.id)

              otherUserChats[chatToChange].photoUrl = photoUrl

              dispatch({
                type: 'UPDATE_USER_PHOTO',
                photoUrl: upload.ref.name
              })

              const updatedChats = otherUserChats
              await updateDoc(uRef, {
                chats: updatedChats
              })
            }
          })
        }))
      }
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