import {addDoc, getDocs, collection, QuerySnapshot, getFirestore, Firestore} from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import * as dotenv from 'dotenv';
dotenv.config();

export interface FirestoreUtilResponse {
    type: 'success' | 'failure' | 'unauthorized';
    data: any;
    details: string;
}

const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Environment variable ${envVar} is missing`);
    }
});

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class FirestoreUtils {
    firestore: Firestore;

    constructor(db: Firestore) {
        this.firestore = db;
    }

    async updateStudentProgress(userId: string, questionId: string, correctAnswer: string, answerChosen: string, correct: boolean): Promise<FirestoreUtilResponse> {
        try {
            const userRef = collection(this.firestore, 'users');
            const questionRef = collection(userRef, userId, 'questions');

            await addDoc(questionRef, {
                questionId,
                answered: new Date(),
                answerChosen,
                correctAnswer,
                correct
            });

            return {
                type: 'success',
                data: null,
                details: 'Question progress updated successfully'
            };
        } catch (error: any) {
            return {
                type: 'failure',
                data: null,
                details: `Error updating question progress: ${error.message}`
            };
        }
    }

    async getUserProgress(userId: string): Promise<FirestoreUtilResponse> {
        try {
            const questionsRef = collection(db, `users/${userId}/questions`);
            const questionsSnapshot = await getDocs(questionsRef);
            const questions = questionsSnapshot.docs.map(doc => doc.data());

            return {
                type: 'success',
                data: questions,
                details: 'User progress retrieved successfully'
            };
        } catch (error: any) {
            return {
                type: 'failure',
                data: null,
                details: `Error retrieving user progress: ${error.message}`
            };
        }
    }
}

export default FirestoreUtils;