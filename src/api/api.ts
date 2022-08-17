import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocFromServer,
  getDocs,
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
  createUserWithEmailAndPassword
} from 'firebase/auth'
import app from '../fb'
import { Chat, LoginRes, UserData } from '../types/api/loginRes';
import { useDispatch } from 'react-redux';
import { GetChatRes } from '../types/api/getChat';
import { GetChatsRes } from '../types/api/getChatsRes';
import { Message } from '../types/chat/messages';
import { ChatInfo } from '../types/reducers/chatsReducer';
import { SendMessageProps } from '../types/api/sendMessage';
import { SignUpProps, SignUpRes } from '../types/api/signUp';
import { AddChatRes, OtherUser } from '../types/api/addChat';
import { UserChatList } from '../types/chat/UserChatList';


const db = getFirestore(app)


const useApi = () => {

  const dispatch = useDispatch()

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
            avatar: 'default.webp',
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
      let res: LoginRes = {
        success: true
      }

      await signInWithEmailAndPassword(getAuth(), email, password)
        .then(async (cred) => {
          let token: string = await cred.user.getIdToken()

          const userRef = doc(db, "users", cred.user.uid)
          let userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            const userInfo = userSnap.data()

            res.user = {
              avatar: userInfo.avatar,
              chats: userInfo.chats,
              email: userInfo.email,
              name: userInfo.name,
              token: token,
              id: cred.user.uid,
              photoUrl: cred.user.photoURL,
            }

            onSnapshot(userRef,
              (doc) => {
                if (doc.exists()) {
                  const snapInfo = doc.data();

                  let user: UserData = {
                    avatar: snapInfo.avatar,
                    chats: snapInfo.chats as Chat[],
                    email: snapInfo.email,
                    name: snapInfo.name,
                    token: token,
                    id: doc.id,
                    photoUrl: cred.user.photoURL,
                  }

                  dispatch({
                    type: 'UPDATE_USER_INFO',
                    payload: { userData: user }
                  })
                }
              }, (error) => {
                res.success = false
                res.error = {
                  message: error.message,
                  code: error.code
                };
              }
            )
          } else {
            res.success = false
            res.error = {
              code: 'login/user-dont-exists',
              message: ''
            }
          }

        })
        .catch(error => {
          res.success = false
          res.error = error
        })

      return res
    },
    addChat: async (userId: string, userAvatar: string, userName: string, emailTo: string) => {
      let res: AddChatRes = {
        success: true
      }

      const otherUserQuery = query(usersRef, where("email", "==", emailTo))
      const qSnap = await getDocsFromServer(otherUserQuery)

      let otherUser: OtherUser = {
        id: '',
        email: '',
        avatar: '',
        name: ''
      }

      qSnap.forEach((doc) => {
        if (doc.exists()) {
          const data = doc.data()
          otherUser = {
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
          return res
        }
      })

      let add = await addDoc(chatsRef, {
        messages: [],
        users: [
          userId,
          otherUser.id
        ]
      })

      updateDoc(doc(db, "users", userId), {
        chats: arrayUnion({
          chatId: add.id,
          chatLastMsg: '',
          lastMessageDate: Timestamp.now(),
          chatName: otherUser.name,
          photoUrl: otherUser.avatar
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

      qSnap.forEach(chat => {
        const data = chat.data()
        const id = chat.id
        const cRef = chat.ref.path

        const obj = {
          users: data.users,
          messages: data.messages,
          id: id,
          ref: cRef
        }
        chatsList.push(obj)

        let docRef = doc(db, "chats", chat.id)
        onSnapshot(docRef, (snapShot) => {  // onChange chat

          if (!snapShot.metadata.isEqual(chat.metadata)) {

            if (snapShot.exists()) {
              const chatData = snapShot.data()
              const lastMsg: Message = chatData.messages[chatData.messages.length - 1]

              chatData.users.forEach(async (u: string) => {
                const userDoc = doc(db, "users", u)
                const userInfo = await getDoc(userDoc)

                if (userInfo.exists()) {
                  const userChats: UserChatList[] = userInfo.data().chats
                  const chatItemToChange = userChats.findIndex(c => c.chatId === snapShot.id)
                  const modifiedChat: UserChatList = {
                    chatLastMsg: lastMsg.body,
                    lastMessageDate: lastMsg.date,
                    chatId: userChats[chatItemToChange].chatId,
                    chatName: userChats[chatItemToChange].chatName,
                    photoUrl: userChats[chatItemToChange].photoUrl
                  }

                  let newUserChatsList = [
                    modifiedChat,
                    ...userChats.filter((c, k) => k !== chatItemToChange),
                  ]
                  await updateDoc(userDoc, {
                    chats: newUserChatsList
                  })
                }
              })

              dispatch({
                type: 'UPDATE_CHAT',
                payload: {
                  chatData: snapShot.data(),
                  chatId: snapShot.id,
                }
              })
            }

          }
        })
      })

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
    getChatPhoto: async (loggedUserId: string, chatId: string) => {
      const userRef = doc(db, "users", loggedUserId)
      const userInfo = await getDoc(userRef)

      if (userInfo.exists()) {
        const data = userInfo.data()
        const chat = data.chats.filter((c: UserChatList) => c.chatId === chatId)[0]
        return chat.photoUrl
      } else {
        return 'default.webp'
      }
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

      // get logic from getUserChats
    },


    saveToken: (token: string) => {
      localStorage.setItem('token', token)
    },
    getSavedToken: () => {
      return localStorage.getItem('token')
    },

    logout: async () => {
      localStorage.removeItem('token')

      await signOut(getAuth())
    }
  })

}


export default useApi