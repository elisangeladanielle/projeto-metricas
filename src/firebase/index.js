import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/messaging'
import 'firebase/functions'

export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDROsogBl_o6CIj9EXZCCBT_-KbU7ZUSkM',
  authDomain: 'projetomkt-a0624.firebaseapp.com',
  databaseURL: 'https://projetomkt-a0624.firebaseio.com',
  projectId: 'projetomkt-a0624',
  storageBucket: 'projetomkt-a0624.appspot.com',
  messagingSenderId: '624049329130',
  appId: '1:624049329130:web:51f75a20184920fc'
})

export default function install (Vue) {
  Object.defineProperty(Vue.prototype, '$firebase', {
    get () {
      return firebaseApp
    }
  })
}
