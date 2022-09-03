import { UserCredential } from "firebase/auth"
import { DocumentSnapshot } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "../../fb"
import { Chat, UserData } from "../../types/api/loginRes"
import UserInFirestore from "../../types/fb-firestore/user"

export const parseChatsList = async (chats: Chat[]) => {
  let list: Chat[] = []

  chats.forEach(async c => {
    let url = await getDownloadURL(ref(storage, c.photoUrl))
    list.push({ ...c, photoUrl: url })
  })

  return list
}

export const getUserObj = async (cred: UserCredential, userData: UserInFirestore) => ({
  // avatar: userData.avatar,
  avatar: await getDownloadURL(ref(storage, `profilesPhotos/${userData.avatar}`)),
  chats: userData.chats,
  email: userData.email,
  name: userData.name,
  token: await cred.user.getIdToken(),
  id: cred.user.uid,
  photoUrl: cred.user.photoURL
})

export const userOnSnap = async (
  doc: DocumentSnapshot,
  token: string,
  dispatch: ({ type, payload }: { type: string, payload: any }) => void
) => {
  if (doc.exists()) {
    const userData = doc.data() as UserInFirestore

    const userObj: UserData = {
      avatar: await getDownloadURL(ref(storage, `profilesPhotos/${userData.avatar}`)),
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