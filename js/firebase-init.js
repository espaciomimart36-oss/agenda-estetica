import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBc5435tsDnJ_yJqO1ppwSjxSpCIhpjgew",
    authDomain: "estetica-8d067.firebaseapp.com",
    projectId: "estetica-8d067",
    storageBucket: "estetica-8d067.firebasestorage.app",
    messagingSenderId: "501220214938",
    appId: "1:501220214938:web:af6e262c23d9a7ea853723"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };