import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyByZhHnoKm_goRlrY9QTsmOA8vi0slHnZ4",
  authDomain: "yallahplay1.firebaseapp.com",
  projectId: "yallahplay1",
  storageBucket: "yallahplay1.firebasestorage.app",
  messagingSenderId: "725180379926",
  appId: "1:725180379926:web:f8cac65a80d47fabd4d637",
  measurementId: "G-3LS5NT7CSB"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);