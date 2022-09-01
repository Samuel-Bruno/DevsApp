import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocsFromServer,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
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

import { getUserObj, userOnSnap } from './helpers/login'

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

  const dispatch = useDispatch()

  const Auth = getAuth()

  const chatsRef = collection(db, 'chats')
  const usersRef = collection(db, 'users')

  return ({
    signup: async ({ name, email, password }: SignUpProps) => {
      let res: SignUpRes = {
        success: true
      }

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
          let token = await cred.user.getIdToken()

          const userRef = doc(usersRef, cred.user.uid)
          const userDoc = await getDocFromServer(userRef)

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserInFirestore
            const chatsList = userData.chats

            res.user = await getUserObj(cred, token, userData, chatsList)

            onSnapshot(userRef,
              async doc => {
                if (doc.metadata.isEqual(userDoc.metadata) == false) {
                  userOnSnap(doc, userDoc.metadata, token, dispatch)
                }
              },
              (error) => {
                res = { success: false, error: { message: error.message, code: error.code } }
              }
            )

          } else {
            res = {
              success: false,
              error: { code: 'login/user-dont-exists', message: '' }
            }
          }
        }).catch(error => {
          res = { success: false, error: { message: error.message, code: error.code } }
        })

      return res
    },
    addChat: async (userId: string, userAvatar: string, userName: string, emailTo: string) => {
      let res: AddChatRes = { success: true }

      const otherUserQuery = query(usersRef, where("email", "==", emailTo))
      const qSnap = await getDocsFromServer(otherUserQuery)
      const thisUser = await getDocFromServer(doc(usersRef, userId))

      if (!qSnap.empty) {
        let otherUser: OtherUser = {
          chats: [],
          id: '',
          email: '',
          avatar: '',
          name: ''
        }

        qSnap.forEach((doc) => {
          if (doc.exists()) {
            const data = doc.data()
            otherUser = {
              chats: data.chats,
              id: doc.id,
              avatar: data.avatar,
              email: data.email,
              name: data.name
            }
          } else {
            res.success = false
            res.error = {
              code: 'user/not-found',
              message: 'Usuário não encontrado'
            }
          }
        })

        if (res.success === false) return res


        if (thisUser.exists()) {
          const thisUserChats = await getDocsFromServer(query(chatsRef, where("users", "array-contains", userId)))
          const existingChat = thisUserChats.docs.some(c => c.get("users").includes(otherUser.id))
          if (existingChat) {
            res = {
              success: false,
              error: { code: 'chat/already-exists', message: 'Você já tem um chat com este usuário' }
            }
          } else {
            let otherUserChatWithThisUser = otherUser.chats.find(
              async c => await (await getDocFromServer(doc(chatsRef, c.chatId))).get('users').includes(userId)
            )
            if (otherUserChatWithThisUser !== undefined) {
              let chatInFS = await getDocFromServer(doc(chatsRef, otherUserChatWithThisUser.chatId))
              updateDoc(doc(chatsRef, otherUserChatWithThisUser.chatId), {
                users: arrayUnion(userId)
              })
              res.chatDoc = {
                messages: chatInFS.get('messages'),
                users: chatInFS.get('users'),
                id: chatInFS.id,
                ref: chatInFS.ref.path
              }
            }
          }
        }

        if (res.success === false) return res


        let add = await addDoc(chatsRef, {
          messages: [],
          users: [
            userId,
            otherUser.id
          ]
        })

        let pUrl = await getDownloadURL(ref(storage, `profilesPhotos/${otherUser.avatar}`))
        updateDoc(doc(db, "users", userId), {
          chats: arrayUnion({
            chatId: add.id,
            chatLastMsg: '',
            lastMessageDate: Timestamp.now(),
            chatName: otherUser.name,
            photoUrl: pUrl
          })
        })
        updateDoc(doc(db, "users", otherUser.id), {
          chats: arrayUnion({
            chatId: add.id,
            chatLastMsg: '',
            lastMessageDate: Timestamp.now(),
            chatName: userName,
            photoUrl: userAvatar
          })
        })

        res.userChatsList = await (await getDocFromServer(doc(db, "users", userId))).data()?.chats as Chat[]
        const chatDoc = await getDocFromServer(add)
        const chatDocData = chatDoc.data() as ChatData
        res.chatDoc = {
          messages: chatDocData.messages,
          users: chatDocData.users,
          id: chatDoc.id,
          ref: chatDoc.ref.path
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
      let res: GetChatsRes = {
        success: false,
        chats: []
      }

      let chatsList: ChatInfo[] = []

      const q = query(chatsRef, where("users", "array-contains", userId))
      const qSnap = await getDocsFromServer(q)

      if (!qSnap.empty) {
        qSnap.forEach(chat => {
          const data = chat.data()
          const id = chat.id
          const cRef = chat.ref.path

          chatsList.push({
            users: data.users,
            messages: data.messages,
            id: id,
            ref: cRef
          })

          let docRef = doc(chatsRef, chat.id)
          onSnapshot(docRef, (snapShot) => {

            if (snapShot.exists()) {
              const chatData = snapShot.data()
              const lastMsg: Message = chatData.messages[chatData.messages.length - 1]

              chatData.users.forEach(async (u: string) => {
                const userDoc = doc(db, "users", u)
                const userInfo = await getDoc(userDoc)

                if (userInfo.exists()) {
                  const userChats: UserChatList[] = userInfo.data().chats
                  const chatItemToChange = userChats.findIndex(c => c.chatId === snapShot.id)

                  if (chatItemToChange > -1) {
                    const modifiedChat: UserChatList = {
                      chatLastMsg: lastMsg.body ?? '',
                      chatLastMsgType: lastMsg.type,
                      lastMessageDate: lastMsg.date,
                      chatId: userChats[chatItemToChange].chatId,
                      chatName: userChats[chatItemToChange].chatName,
                      photoUrl: userChats[chatItemToChange].photoUrl,
                    }

                    let newUserChatsList = [
                      modifiedChat,
                      ...userChats.filter((c, k) => k !== chatItemToChange),
                    ]
                    await updateDoc(userDoc, { chats: newUserChatsList })
                  }
                }

                if (chatData.users.includes(userId)) {
                  dispatch({
                    type: 'UPDATE_CHAT',
                    payload: { chatData: chatData, chatId: snapShot.id }
                  })
                }
              })

            }
          })
        })
      }

      res.chats = chatsList
      res.success = true

      return res
    },
    getChat: async (chatId: string) => {
      let res: GetChatRes = {
        success: false
      }
      const chatRef = doc(db, "chats", chatId)
      const chatSnap = await getDoc(chatRef)

      if (chatSnap.exists()) {
        res.chat = {
          users: chatSnap.data().users,
          messages: chatSnap.data().messages,
          id: chatSnap.data(),
          ref: chatSnap.ref.path
        }
        res.success = true
      } else {
        res.error = {
          code: 'document/not-found'
        }
      }

      onSnapshot(
        chatRef,
        (doc) => {
          if (doc.exists()) {
            let docData = doc.data()
            let docPayload = {
              chatData: docData,
              chatId: doc.id,
              chatRef: doc.ref.path
            }
            dispatch({
              type: 'UPDATE_CHAT_INFO',
              payload: docPayload
            })
          }
        }
      )

      return res
    },
    delChat: async (chatId: string, userId: string) => {
      const chatRef = doc(chatsRef, chatId)
      const chat = await getDocFromServer(chatRef)

      if (chat.exists()) {

        const userRef = doc(usersRef, userId)
        const userDoc = await getDocFromServer(userRef)
        if (userDoc.exists()) {
          const userChats = userDoc.data().chats as Chat[]
          const newList = userChats.filter((c: Chat) => c.chatId !== chatId)
          await updateDoc(userRef, {
            chats: newList
          })
        }

        const data = chat.data() as ChatInfo
        const chatUsers = data.users
        if (chatUsers.includes(userId)) {
          if (data.users.length === 2) {
            await updateDoc(chatRef, { users: data.users.filter((id: string) => id !== userId) })
          } else if (chatUsers.length === 1) {
            await deleteDoc(chatRef)
          }
        }
      }

    },
    getChatPhoto: async (loggedUserId: string, chatId: string) => {
      const userRef = doc(db, "users", loggedUserId)
      const userInfo = await getDoc(userRef)

      if (userInfo.exists()) {
        const data = userInfo.data()
        const chat = data.chats.filter((c: UserChatList) => c.chatId === chatId)[0]
        return await getDownloadURL(ref(storage, `profilesPhotos/${chat.photoUrl}`))
      } else {
        return await getDownloadURL(ref(storage, `profilesPhotos/default_user.jpg`))
      }
    },
    getChatsPhotos: async (chats: Chat[]) => {
      let list: Chat[] = []

      chats.forEach(async c => {
        let photoRef = ref(storage, `profilesPhotos/${c.photoUrl}`)
        let url = await getDownloadURL(photoRef)
        list.push({ ...c, photoUrl: url })
      })

      return list
    },
    getUserInfo: async (userId: string) => {
      const userRef = doc(db, "users", userId)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        return data
      }
    },
    getUserName: async (userId: string) => {
      let user = await getDoc(doc(db, "users", userId))
      if (user.exists()) return user.data().name
    },

    sendMessage: async (props: SendMessageProps) => {
      let { msgType, msgBody, chat, userId } = props
      let ts = Timestamp.fromDate(new Date())

      let msgObj: Message = {
        body: msgBody,
        date: ts,
        from: userId,
        to: chat.users.filter(u => u !== userId)[0],
        type: msgType
      }

      const chatRef = doc(db, "chats", chat.id as string)
      await updateDoc(chatRef, {
        messages: arrayUnion(msgObj)
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
        let upload: UploadResult | null = null
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
              otherUserChats[chatToChange].photoUrl = upload?.ref.fullPath as string

              const updatedChats = otherUserChats
              await updateDoc(uRef, { chats: updatedChats })
            }
          })
        }))

        if (upload !== null) {
          dispatch({
            type: 'UPDATE_USER_PHOTO',
            photoUrl: await getDownloadURL(ref(storage, upload.ref.fullPath))
          })
        }

        // const pastPhotoRef = ref(storage, Auth.currentUser?.photoURL as string)
        // deleteObject(pastPhotoRef)
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
        let upload: UploadResult | null = null
        let photoUrl = ''

        if (imagesTypesAllowed.includes(avatar.type)) {
          let hashName = ref(storage, `profilesPhotos/${createId()}`)
          upload = await uploadBytes(hashName, avatar)
          photoUrl = await getDownloadURL(ref(storage, upload.ref.fullPath))
        }

        await updateDoc(userRef, { avatar: upload?.ref.name })

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

              otherUserChats[chatToChange].photoUrl = upload?.ref.fullPath as string

              const updatedChats = otherUserChats
              await updateDoc(uRef, { chats: updatedChats })
            }
          })
        }))

        if (upload !== null) {
          dispatch({
            type: 'UPDATE_USER_PHOTO',
            payload: { photoUrl }
          })
        }

        await deleteObject(ref(storage, `profilesPhotos/${userProfileNameRef}`))
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
    }
  })

}


export default useApi