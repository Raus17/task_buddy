import { initializeApp , getApps, getApp} from "firebase/app";
import { initializeAuth,getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANFZcl34LHenC4jj5Zw0ZCXyhs6rWOpKo",
  authDomain: "taskbuddy-dd381.firebaseapp.com",
  projectId: "taskbuddy-dd381",
  storageBucket: "taskbuddy-dd381.firebasestorage.app",
  messagingSenderId: "355751631967",
  appId: "1:355751631967:web:ce01bd081b7f34476d4fea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider , storage };
export const db = getFirestore(app); 
