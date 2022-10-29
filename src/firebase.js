import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCTZmQ8TSWpQy11cjDTwaCIEq3-l72MQRE",
  authDomain: "cu-wingman.firebaseapp.com",
  projectId: "cu-wingman",
  storageBucket: "cu-wingman.appspot.com",
  messagingSenderId: "130285163383",
  appId: "1:130285163383:web:8d8fa250cb54c5dc134772"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db}