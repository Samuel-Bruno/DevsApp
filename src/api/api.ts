import {
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  getDocsFromServer,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
  getAuth,
  updateCurrentUser,
  signOut,
} from 'firebase/auth'
import app from '../fb'
import { Chat, LoginRes, UserData } from '../types/api/loginRes';
import { useDispatch } from 'react-redux';
import { GetChatRes } from '../types/api/getChat';
import { GetChatsRes } from '../types/api/getChatsRes';
import { Message } from '../types/chat/messages';
import { ChatInfo } from '../types/reducers/chatsReducer';
import { SendMessageProps } from '../types/api/sendMessage';


const db = getFirestore(app)


const useApi = () => {

  const dispatch = useDispatch()

  const chatsRef = collection(db, 'chats')
  const users = collection(db, 'users')

  return ({
    login: async (email: string, password: string) => {
      let res: LoginRes = {
        success: true
      }

      await signInWithEmailAndPassword(getAuth(), email, password)
        .then(async (cred) => {
          let token: string = await cred.user.getIdToken()

          let userSnap = await getDoc(doc(db, "users", cred.user.uid))
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
          } else {
            res.success = false
            res.error = {
              code: 'login/user-dont-exists',
              message: ''
            }
          }


          onSnapshot(
            doc(db, "users", cred.user.uid),
            (doc) => {
              if (doc.exists()) {
                const userInfo = doc.data();

                let user: UserData = {
                  avatar: userInfo.avatar,
                  chats: userInfo.chats as Chat[],
                  email: userInfo.email,
                  name: userInfo.name,
                  token: token,
                  id: cred.user.uid,
                  photoUrl: cred.user.photoURL,
                }

                dispatch({
                  type: 'UPDATE_USER_INFO',
                  payload: {
                    userData: user
                  }
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

        })
        .catch(error => {
          res.success = false
          res.error = error
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

        const obj = {
          users: data.users,
          messages: data.messages,
          id: id,
        }
        chatsList.push(obj)

        let docRef = doc(db, "chats", chat.id)
        onSnapshot(docRef, (snapShot) => {
          dispatch({
            type: 'UPDATE_CHAT',
            payload: {
              chatData: snapShot.data(),
              chatId: snapShot.id,
            }
          })
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
            // dispatch({
            //   type: 'UPDATE_CHAT_INFO',
            //   payload: docPayload
            // })
          }
        }
      )

      return res
    },


    sendMessage: async (props: SendMessageProps) => {
      let { msgType, msgBody, chatId, chatUsers, userId } = props
      let dateNow = new Date()

      let msgObj: Message = {
        body: msgBody,
        date: new Timestamp(dateNow.getUTCSeconds(), dateNow.getUTCMilliseconds()),
        from: userId,
        to: chatUsers.filter(u => u !== userId)[0],
        type: msgType
      }

      const chatRef = doc(db, "chats", chatId)
      await updateDoc(chatRef, {
        messages: arrayUnion(msgObj)
      })
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