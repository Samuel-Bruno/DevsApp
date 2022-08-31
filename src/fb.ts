import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCOYlhZGrIrOqW0Xsfp0UP-D47CTyajoQ0",
  authDomain: "devsapp-870d2.firebaseapp.com",
  projectId: "devsapp-870d2",
  storageBucket: "devsapp-870d2.appspot.com",
  messagingSenderId: "237160109462",
  appId: "1:237160109462:web:1ec8bbd56f8581bcea79b7"
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
export default app