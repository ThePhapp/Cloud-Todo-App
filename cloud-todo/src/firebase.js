import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where, orderBy, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRWqn2Gyei3yo-73HUN0ruy0gyJewjCdY",
  authDomain: "cloud-todo-app-63d10.firebaseapp.com",
  projectId: "cloud-todo-app-63d10",
  storageBucket: "cloud-todo-app-63d10.firebasestorage.app",
  messagingSenderId: "330483776425",
  appId: "1:330483776425:web:30cb4244830377633ae2b8",
  measurementId: "G-5566DNGBXZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export {
  signInWithPopup,
  signOut,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
};
