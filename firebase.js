// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQuxTRKdL2Q1BYVyF0I3dHEU2aRpHe6Zw",
  authDomain: "inventory-management-5b632.firebaseapp.com",
  projectId: "inventory-management-5b632",
  storageBucket: "inventory-management-5b632.appspot.com",
  messagingSenderId: "144782201213",
  appId: "1:144782201213:web:89867f1913b1385124bc14",
  measurementId: "G-K15Z3PPJ20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}