import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth"
import { doc, DocumentSnapshot, getDocFromServer, getFirestore, onSnapshot } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import { useDispatch } from "react-redux"
import { storage } from "../fb"
import { Chat, LoginRes, UserData } from "../types/api/loginRes"
import UserInFirestore from "../types/fb-firestore/user"

export const login = async (email: string, password: string) => {

  const firestore = getFirestore()
  const Auth = getAuth()
  const dispatch = useDispatch()

  let res: LoginRes = { success: true }

  await signInWithEmailAndPassword(Auth, email, password)
    .then(async (cred: UserCredential) => {
      let token = await cred.user.getIdToken()

      const userRef = doc(firestore, cred.user.uid)
      const userDoc = await getDocFromServer(userRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const chatsList = await parseChatsList(userData.chats as Chat[])

        res.user = getUserObj(cred, token, userData, chatsList)

        onSnapshot(userRef,
          async doc => userOnSnap(doc, token, dispatch),
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
}

const getUserObj = (cred: UserCredential, token: string, userData: any, chatsList: any[]) => ({
  avatar: userData.avatar,
  chats: chatsList,
  email: userData.email,
  name: userData.name,
  token: token,
  id: cred.user.uid,
  photoUrl: cred.user.photoURL
})

const parseChatsList = async (chats: Chat[]) => {
  let list: Chat[] = []

  chats.forEach(c => {
    let photoRef = ref(storage, c.photoUrl)
    getDownloadURL(photoRef).then(result => {
      list.push({ ...c, photoUrl: result })
    })
  })

  return list
}

const userOnSnap = async (doc: DocumentSnapshot, token: string, dispatch: ({ }: any) => void) => { // on change Doc
  if (doc.exists()) {
    const userData = doc.data() as UserInFirestore

    let profilePhotoUrl = await getDownloadURL(ref(storage, `profilesPhotos/${userData.avatar}`))

    const userObj: UserData = {
      avatar: profilePhotoUrl,
      chats: userData.chats,
      email: userData.email,
      id: doc.id,
      name: userData.name,
      photoUrl: null,
      token: token
    }

    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: {
        userData: userObj
      }
    })

  }
}