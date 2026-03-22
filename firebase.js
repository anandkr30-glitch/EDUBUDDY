import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeFf1knVPtXjwYDPDOhF28BdXyrmztXOI",
  authDomain: "edubuddy-99cb5.firebaseapp.com",
  projectId: "edubuddy-99cb5",
  storageBucket: "edubuddy-99cb5.firebasestorage.app",
  messagingSenderId: "2780437380",
  appId: "1:2780437380:web:ce9eb9d987222aea275bd1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);