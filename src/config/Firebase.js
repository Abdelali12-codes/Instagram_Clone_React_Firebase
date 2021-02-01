import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/messaging'

// const config = {
//     apiKey: "AIzaSyDAbr7hGc6vfSSTyM7SbgjXOi7Zr6d5xkw",
//     authDomain: "react-app-auth-3e2cb.firebaseapp.com",
//     databaseURL: "https://react-app-auth-3e2cb.firebaseio.com",
//     projectId: "react-app-auth-3e2cb",
//     storageBucket: "react-app-auth-3e2cb.appspot.com",
//     messagingSenderId: "974945608275",
//     appId: "1:974945608275:web:45e81023afb4a8a758dca6",
//     measurementId: "G-C5BLNK3LBR"
//   };

const config = {
    apiKey: "AIzaSyDP14Wed22gzmKW3ZVWtoC2IXlz2zLNcmM",
    authDomain: "instagram-clone-84392.firebaseapp.com",
    databaseURL: "https://instagram-clone-84392.firebaseio.com",
    projectId: "instagram-clone-84392",
    storageBucket: "instagram-clone-84392.appspot.com",
    messagingSenderId: "785627099605",
    appId: "1:785627099605:web:ecebf066d81d4879588d5c",
    measurementId: "G-7MWPZQE3BX"
};


firebase.initializeApp(config)

firebase.messaging().onMessage(payload =>{
    console.log(payload)
})

export default firebase
