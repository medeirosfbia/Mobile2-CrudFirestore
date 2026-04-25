import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: 'AIzaSyDXCht-n9yF6SN-CX_lEpvVuhFkyQm5tJI',
    authDomain: 'crud-firebase-mobile2.firebaseapp.com',
    projectId: 'crud-firebase-mobile2',
    storageBucket: 'crud-firebase-mobile2.firebasestorage.app',
    messagingSenderId: '979929955335',
    appId: '1:979929955335:web:a1bb000e70ba53d13cfea2'
};

const app = initializeApp(firebaseConfig);

const auth =
    Platform.OS === 'web'
        ? getAuth(app)
        : initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });

export { auth };
export const db = getFirestore(app);
