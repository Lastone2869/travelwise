// Firebase configuration for TravelWise
// Replace the values below with your actual Firebase project config.
// Go to: Firebase Console → Project Settings → Your Apps → Web App → Config

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAh5Ly9YozsRNNl_rD4VnoIstb-wPA1Stg",
  authDomain: "travelwise-185c6.firebaseapp.com",
  projectId: "travelwise-185c6",
  storageBucket: "travelwise-185c6.firebasestorage.app",
  messagingSenderId: "206725832634",
  appId: "1:206725832634:web:69d7347d3d3e9ad1104783"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export auth and firestore instances
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
