import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyDy8YbpaTk2Tg1sJgg1htkus4oIM4tVkSY",
  authDomain: "devsappdevelopment.firebaseapp.com",
  projectId: "devsappdevelopment",
  storageBucket: "devsappdevelopment.appspot.com",
  messagingSenderId: "502088314452",
  appId: "1:502088314452:web:b6858ec26f85cc6b8787c1",
  measurementId: "G-XMXGFMF5WR"
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
export default app