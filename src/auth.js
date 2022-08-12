import firebase from 'firebase/app'
import 'firebase/auth'

// Get a Auth instance
const firebaseConfig = {
  apiKey: 'AIzaSyARZkRk7W3o8xaJI5RRCB2JsqhC3Ouc6dA',
  authDomain: 'reddit-clone-643f9.firebaseapp.com',
  databaseURL: 'https://reddit-clone-643f9.firebaseio.com',
  projectId: 'reddit-clone-643f9',
  storageBucket: 'reddit-clone-643f9.appspot.com',
  messagingSenderId: '936081533108',
  appId: '1:936081533108:web:0894360e043f8585ac8fe1'
}

export const auth = firebase
  .initializeApp(firebaseConfig)
  .auth()
