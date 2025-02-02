// Import the functions you need from the SDKs you need
import { initializeApp , getApps, getApp} from "firebase/app";
import { initializeAuth,getAuth, GoogleAuthProvider, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANFZcl34LHenC4jj5Zw0ZCXyhs6rWOpKo",
  authDomain: "taskbuddy-dd381.firebaseapp.com",
  projectId: "taskbuddy-dd381",
  storageBucket: "taskbuddy-dd381.firebasestorage.app",
  messagingSenderId: "355751631967",
  appId: "1:355751631967:web:ce01bd081b7f34476d4fea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
