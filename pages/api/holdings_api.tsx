// api calls related to holdings page
import { collection, addDoc } from "firebase/firestore"; 
import {db} from "../../Firebase/config.js"
const docRef = db.collection('users').doc('alovelace');

await docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});