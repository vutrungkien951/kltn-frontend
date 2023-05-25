import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';
const firebaseConfig = {
    // TODO: Add your Firebase configuration here
    apiKey: "AIzaSyB_wNRG4KptDHUHS1mjdLWgbjZ-SJSoBSg",

    authDomain: "scientific-journal-aa37f.firebaseapp.com",

    projectId: "scientific-journal-aa37f",

    storageBucket: "scientific-journal-aa37f.appspot.com",

    messagingSenderId: "366703267609",

    appId: "1:366703267609:web:4bfe474e071280019b7f88",

    measurementId: "G-LH585PWYXD"

};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sendMessage(roomId, user, text) {
    try {
        await addDoc(collection(db, 'chat-rooms', roomId, 'messages'), {
            uid: user.username,
            displayName: user.username,
            text: text.trim(),
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error(error);
    }
}
function getMessages(roomId, callback) {
    return onSnapshot(
        query(
            collection(db, 'chat-rooms', roomId, 'messages'),
            orderBy('timestamp', 'asc')
        ),
        (querySnapshot) => {
            const messages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messages);
        }
    );
}

async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        const { user } = await signInWithPopup(auth, provider);

        return { uid: user.uid, displayName: user.displayName };
    } catch (error) {
        if (error.code !== 'auth/cancelled-popup-request') {
            console.error(error);
        }

        return null;
    }
}

export { sendMessage, getMessages, loginWithGoogle };