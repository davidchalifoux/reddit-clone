import firebase from 'firebase/app'
import 'firebase/firestore'

export const db = firebase
  .firestore()

const { TimeStamp, GeoPoint } = firebase.firestore
export { TimeStamp, GeoPoint }
