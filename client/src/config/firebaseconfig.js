// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAig7qYekb0fnJGofHzK_oq76hlNARLj08",
  authDomain: "translate-414d6.firebaseapp.com",
  projectId: "translate-414d6",
  storageBucket: "translate-414d6.firebasestorage.app",
  messagingSenderId: "89737825220",
  appId: "1:89737825220:web:50664beca1f7297d1cf291",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
