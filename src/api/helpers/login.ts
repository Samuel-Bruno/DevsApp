import { UserCredential } from "firebase/auth"
import { DocumentSnapshot } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "../../fb"
import { UserData } from "../../types/api/loginRes"
import UserInFirestore from "../../types/fb-firestore/user"


export const getUserObj = (cred: UserCredential, token: string, userData: any, chatsList: any[]) => ({
  avatar: userData.avatar,
  chats: chatsList,
  email: userData.email,
  name: userData.name,
  token: token,
  id: cred.user.uid,
  photoUrl: cred.user.photoURL
})

export const userOnSnap = async (doc: DocumentSnapshot, token: string, dispatch: ({ type, payload }: { type: string, payload: any }) => void) => {
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
      token
    }

    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: { userData: userObj }
    })

  }
}