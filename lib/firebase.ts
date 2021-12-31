import {initializeApp} from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  projectId: process.env.NEXT_PUBLIC_projectId,
  appId: process.env.NEXT_PUBLIC_appId,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
}

export const app = initializeApp(firebaseConfig)
