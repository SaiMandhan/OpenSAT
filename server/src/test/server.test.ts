import { FirestoreUtils, FirestoreUtilResponse } from '../FirestoreUtils';
import { Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

describe('FirestoreUtils', () => {
    let firestoreUtils: FirestoreUtils;

    beforeAll(() => {
        firestoreUtils = new FirestoreUtils(db);
    });

    test('should update student progress successfully', async () => {
        const response: FirestoreUtilResponse = await firestoreUtils.updateStudentProgress(
            'testUserId',
            'testQuestionId',
            'correctAnswer',
            'answerChosen',
            true
        );

        expect(response.type).toBe('success');
        expect(response.details).toBe('Question progress updated successfully');
    });

    test('should fail to update student progress with invalid data', async () => {
        const response: FirestoreUtilResponse = await firestoreUtils.updateStudentProgress(
            '',
            '',
            '',
            '',
            true
        );

        expect(response.type).toBe('failure');
        expect(response.details).toContain('Error updating question progress');
    });

    test('should retrieve user progress successfully', async () => {
        const response: FirestoreUtilResponse = await firestoreUtils.getUserProgress('testUserId');

        expect(response.type).toBe('success');
        expect(response.data).toBeInstanceOf(Array);
        expect(response.details).toBe('User progress retrieved successfully');
    });

    test('should fail to retrieve user progress with invalid userId', async () => {
        const response: FirestoreUtilResponse = await firestoreUtils.getUserProgress('');

        expect(response.type).toBe('failure');
        expect(response.details).toContain('Error retrieving user progress');
    });
});