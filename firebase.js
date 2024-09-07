// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkyfnPydoWjOGtAzGLB9gW-RMdOfdaUZQ",
  authDomain: "inventory-tracker-1c840.firebaseapp.com",
  projectId: "inventory-tracker-1c840",
  storageBucket: "inventory-tracker-1c840.appspot.com",
  messagingSenderId: "819631477153",
  appId: "1:819631477153:web:47ca7a44e120715b827be0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


export {firestore}