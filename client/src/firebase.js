// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCe1cpCmtRpiSdilW3tOiI0kBjUjDQmNUc",
    authDomain: "remotepatient-75414.firebaseapp.com",
    projectId: "remotepatient-75414",
    storageBucket: "remotepatient-75414.appspot.com",
    messagingSenderId: "815887049403",
    appId: "1:815887049403:web:63ea7588e2aac7e081bf9e"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
