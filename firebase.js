// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAKvv-6xqfRj4J4xa3cRN523CSz-JWWC5Y",
  authDomain: "who-is-yu-gi-oh.firebaseapp.com",
  databaseURL: "https://who-is-yu-gi-oh-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "who-is-yu-gi-oh",
  storageBucket: "who-is-yu-gi-oh.firebasestorage.app",
  messagingSenderId: "536811505214",
  appId: "1:536811505214:web:15adf71065e870d3e2f36f",
  measurementId: "G-LT7Y930HGB"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
