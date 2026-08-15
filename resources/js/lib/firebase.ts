import { getAnalytics } from 'firebase/analytics';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA4RZClNh4Qh8Ca3XN7k_RGrIKXKg6To9s',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'student-records-f105c.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'student-records-f105c',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'student-records-f105c.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '705450111164',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:705450111164:web:1a789f597962809687e0b9',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-B7HZ3VFY0G',
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const analytics =
    typeof window !== 'undefined' && firebaseConfig.measurementId
        ? getAnalytics(firebaseApp)
        : null;

export const db = getFirestore(firebaseApp);

export default firebaseApp;
