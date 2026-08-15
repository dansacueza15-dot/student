import { getAnalytics } from 'firebase/analytics';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDwiPQSJBGfPV6z-o3kjYcP1AN8zEp3rFY',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'studentss-67c17.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'studentss-67c17',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'studentss-67c17.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '76446945088',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:76446945088:web:9a35d927864b2f4758f4a5',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-SGV6DQ4GZP',
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const analytics =
    typeof window !== 'undefined' && firebaseConfig.measurementId
        ? getAnalytics(firebaseApp)
        : null;

export const db = getFirestore(firebaseApp);

export default firebaseApp;
