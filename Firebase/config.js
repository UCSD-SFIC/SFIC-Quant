// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDoc, getFirestore} from "firebase/firestore"
import {collection, addDoc} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
// };

const firebaseConfig = {
    apiKey: "AIzaSyAFNANuy4u5ui0_e9YsWTpG3W7Bkq9HVd8",
    authDomain: "sfic-quant-platform.firebaseapp.com",
    projectId: "sfic-quant-platform",
    storageBucket: "sfic-quant-platform.appspot.com",
    messagingSenderId: "445774300790",
    appId: "1:445774300790:web:605bf064640dac272b0157",
    measurementId: "G-S74H2RP292"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export async function setHolding(){
    try{
        const docRef = await addDoc(collection(db, "holdings"),{
            current_quantity: 20,
            reinvest_dividend: true,
            security_type: 'equity',
            ticker: 'AAPL',
            transactions: {
                change: 1,
                date: 'MM-DD-YYYY',
                price: 123,
                transaction_type: 'buy'
            }

        })
            console.log("MADE IT");
            
    }
    catch(e){
        console.log("something is messed: ", e);
    }
}
