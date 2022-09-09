import { doc, getDocFromServer, getDocsFromServer, query, updateDoc, where } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes, UploadResult } from "firebase/storage"
import { v4 as createId } from "uuid"
import { storage } from "../../fb"
import { Props1, Props2, Props3 } from "../../types/api/helpers/updateUser"
import { UserChatList } from "../../types/chat/UserChatList"


const imagesTypesAllowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export const case1 = async ({ userId, avatar, oldPhotoRef, dispatch, userRef, usersRef, chatsRef }: Props1) => {
  let upload: UploadResult
  let photoUrl = ''

  if (imagesTypesAllowed.includes(avatar.type)) {
    upload = await uploadBytes(ref(storage, `profilesPhotos/${createId()}`), avatar)
    photoUrl = await getDownloadURL(ref(storage, upload.ref.fullPath))

    dispatch({ type: 'UPDATE_USER_PHOTO', payload: { photoUrl } })

    await updateDoc(userRef, { avatar: upload.ref.name })
    if (oldPhotoRef !== 'default_user.jpg') {
      await deleteObject(ref(storage, `profilesPhotos/${oldPhotoRef}`))
    }

    const q = query(chatsRef, where("users", "array-contains", userId))
    const chatsUserIn = await getDocsFromServer(q)

    chatsUserIn.docs.forEach((async chat => {
      const otherUser: string = chat.get('users').filter((id: string) => id !== userId)[0]

      const otherUserRef = doc(usersRef, otherUser)
      const otherUserData = await getDocFromServer(otherUserRef)

      if (otherUserData.exists()) {
        let otherUserChats: UserChatList[] = otherUserData.data().chats
        const chatToChange = otherUserChats.findIndex((c) => c.chatId === chat.id)

        otherUserChats[chatToChange].photoUrl = photoUrl

        const updatedChats = otherUserChats
        await updateDoc(otherUserRef, { chats: updatedChats })
      }
    }))
  }

}

export const case2 = async ({ userId, name, dispatch, userRef, usersRef, chatsRef }: Props2) => {
  await updateDoc(userRef, { name })
  dispatch({ type: 'UPDATE_USER_NAME', payload: { newName: name } })

  const q = query(chatsRef, where("users", "array-contains", userId))
  const chatsUserIn = await getDocsFromServer(q)

  chatsUserIn.docs.forEach((async chat => {
    const otherUser = chat.data().users.find((id: string) => id !== userId)[0]
    const otherUserRef = doc(usersRef, otherUser)
    const otherUserData = await getDocFromServer(otherUserRef)

    if (otherUserData.exists()) {
      let otherUserChats = otherUserData.get('chats') as UserChatList[]
      const chatToChange = otherUserChats.findIndex((c) => c.chatId === chat.id)

      otherUserChats[chatToChange].chatName = name

      const updatedChats = otherUserChats
      await updateDoc(otherUserRef, { chats: updatedChats })
    }
  }))
}

export const case3 = async ({ userId, name, avatar, oldPhotoRef, dispatch, userRef, usersRef, chatsRef }: Props3) => {
  let upload: UploadResult
  let photoUrl = ''

  if (imagesTypesAllowed.includes(avatar.type)) {
    upload = await uploadBytes(ref(storage, `profilesPhotos/${createId()}`), avatar)
    photoUrl = await getDownloadURL(ref(storage, `profilesPhotos/${upload.ref.name}`))

    dispatch({ type: 'UPDATE_USER_NAME', payload: { newName: name } })
    dispatch({ type: 'UPDATE_USER_PHOTO', payload: { photoUrl } })

    await updateDoc(userRef, { name, avatar: upload?.ref.name })

    if (oldPhotoRef !== 'default_user.jpg') {
      await deleteObject(ref(storage, `profilesPhotos/${oldPhotoRef}`))
    }

    const q = query(chatsRef, where("users", "array-contains", userId))
    const chatsUserIn = await getDocsFromServer(q)

    chatsUserIn.docs.forEach((async chat => {
      const otherUser: string = chat.get('users').find((id: string) => id !== userId)

      const uRef = doc(usersRef, otherUser)
      const otherUserData = await getDocFromServer(uRef)

      if (otherUserData.exists()) {
        let otherUserChats: UserChatList[] = otherUserData.data().chats
        const chatToChange = otherUserChats.findIndex((c) => c.chatId === chat.id)

        otherUserChats[chatToChange].chatName = name
        otherUserChats[chatToChange].photoUrl = photoUrl

        const updatedChats = otherUserChats
        await updateDoc(uRef, { chats: updatedChats })
      }
    }))
  }
}