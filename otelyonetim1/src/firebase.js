import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDIwLeV33cKq09BxImj-P73hVI_2ufy9iI",
    authDomain: "otel-yonetim.firebaseapp.com",
    projectId: "otel-yonetim",
    storageBucket: "otel-yonetim.appspot.com",
    messagingSenderId: "496579722697",
    appId: "1:496579722697:web:b2e2d06bf1a6d6bb8afc18",
    measurementId: "G-SFRBG2L4NW"
  };




const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
