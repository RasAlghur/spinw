import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
// initialized auth
const auth = getAuth(app)
// initialize analysis
// eslint-disable-next-line
const analytics = getAnalytics(app);
// initialize the storage
const storage = getStorage(app)
// getting the references of specific collections
const colRef = collection(database, 'games');
const colRefRefer = collection(database, 'refers');
const colShort = collection(database, 'shorts');



export { colRef, database, colShort, colRefRefer, auth, storage }
