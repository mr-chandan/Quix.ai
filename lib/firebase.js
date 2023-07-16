import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAYPz6gH9JG-R29Oh-0-ADWxmzCXcYnO8",
  authDomain: "quixx-132ba.firebaseapp.com",
  projectId: "quixx-132ba",
  storageBucket: "quixx-132ba.appspot.com",
  messagingSenderId: "683329730150",
  appId: "1:683329730150:web:0ef7ed2ffe3c343a2d9fa7"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

