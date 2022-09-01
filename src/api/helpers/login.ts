import { UserCredential } from "firebase/auth"
import { DocumentSnapshot, SnapshotMetadata } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "../../fb"
import { Chat, UserData } from "../../types/api/loginRes"
import UserInFirestore from "../../types/fb-firestore/user"


export const parseChatsListToGetPhotoUrl = async (chats: Chat[]) => {
  let list: Chat[] = []

  chats.forEach(async c => {
    let url = await getDownloadURL(ref(storage, c.photoUrl))
    list.push({ ...c, photoUrl: url })
  })

  return list
}

export const getUserObj = async (cred: UserCredential, token: string, userData: any, chatsList: any[]) => {
  let profilePhotoUrl = await getDownloadURL(ref(storage, `profilesPhotos/${userData.avatar}`))
  let parsedList = await parseChatsListToGetPhotoUrl(chatsList)

  return ({
    avatar: profilePhotoUrl,
    chats: parsedList,
    email: userData.email,
    name: userData.name,
    token: token,
    id: cred.user.uid,
    photoUrl: cred.user.photoURL
  })
}

export const userOnSnap = async (doc: DocumentSnapshot, userDocMetadata: SnapshotMetadata, token: string, dispatch: ({ type, payload }: { type: string, payload: any }) => void) => {
  if (doc.exists()) {

    const userData = doc.data() as UserInFirestore
    console.log("userData in userSnap", userData)

    let profilePhotoUrl = await getDownloadURL(ref(storage, `profilesPhotos/${doc.get('avatar')}`))
    let parsedList = await parseChatsListToGetPhotoUrl(userData.chats)

    const userObj: UserData = {
      avatar: profilePhotoUrl,
      chats: parsedList,
      email: userData.email,
      id: doc.id,
      name: userData.name,
      photoUrl: null,
      token
    }

    if (!doc.metadata.isEqual(userDocMetadata)) {
      dispatch({
        type: 'UPDATE_USER_INFO',
        payload: { userData: userObj }
      })
    }

  }
}