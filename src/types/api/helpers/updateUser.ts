import { CollectionReference, DocumentReference } from "firebase/firestore";

export type Props1 = {
  userId: string;
  avatar: File;
  oldPhotoRef: string;
  dispatch: ({ type, payload }: { type: string, payload: any }) => void
  userRef: DocumentReference;
  usersRef: CollectionReference;
  chatsRef: CollectionReference;
}

export type Props2 = {
  userId: string;
  name: string;
  dispatch: ({ type, payload }: { type: string, payload: any }) => void
  userRef: DocumentReference;
  usersRef: CollectionReference;
  chatsRef: CollectionReference;
}

export type Props3 = Props1 & {
  name: string;
}