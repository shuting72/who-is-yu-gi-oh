// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD2-bbUTfvR6ZW-RlzTMyA_qjYZlJNCmbo",
  authDomain: "scoreboardd-9436a.firebaseapp.com",
  databaseURL: "https://scoreboardd-9436a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "scoreboardd-9436a",
  storageBucket: "scoreboardd-9436a.firebasestorage.app",
  messagingSenderId: "986267726051",
  appId: "1:986267726051:web:4cf46c289f1d3b87d195d6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
