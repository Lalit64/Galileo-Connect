import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBDToLbU6s7uXawjifyHkJWlAZAy7en18A",
  authDomain: "galileoconnect.firebaseapp.com",
  projectId: "galileoconnect",
  storageBucket: "galileoconnect.appspot.com",
  messagingSenderId: "367942904962",
  appId: "1:367942904962:web:03a87bbedd58b45141d89b",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
