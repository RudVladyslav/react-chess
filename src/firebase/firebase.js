import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBv8gKyuJdWWc1Nks1MeforwIykdFFB-Ms",
    authDomain: "react-chess-cbc98.firebaseapp.com",
    projectId: "react-chess-cbc98",
    storageBucket: "react-chess-cbc98.appspot.com",
    messagingSenderId: "177396998946",
    appId: "1:177396998946:web:f361216e4d9337a485fb7b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()
export const auth = firebase.auth()

export default firebase