import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiWFR1ozHWEGg_QOkNvxZwbcXP5huq3dM",
  authDomain: "habit-tracker-app-8b422.firebaseapp.com",
  projectId: "habit-tracker-app-8b422",
  storageBucket: "habit-tracker-app-8b422.firebasestorage.app",
  messagingSenderId: "196986427309",
  appId: "1:196986427309:web:d8abb85ec6f8720b447324"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };