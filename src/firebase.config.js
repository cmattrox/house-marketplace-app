import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD7jiVqGpMDDQmNM3ndGphQGdP9PN8LFBM',
  authDomain: 'house-marketplace-app-a9046.firebaseapp.com',
  projectId: 'house-marketplace-app-a9046',
  storageBucket: 'house-marketplace-app-a9046.appspot.com',
  messagingSenderId: '1009256391428',
  appId: '1:1009256391428:web:76cea7dce822d1009f6651',
}

initializeApp(firebaseConfig)

export const db = getFirestore()
