import { FirestoreUtils, FirestoreUtilResponse } from '../FirestoreUtils';
import { Firestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
//import { Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();
//comment out when you use env. 
const serviceAccountPath = path.join(__dirname, '../../res/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

describe('FirestoreUtils', () => {
    let firestoreUtils: FirestoreUtils;

    beforeAll(() => {
        firestoreUtils = new FirestoreUtils(db);
    });

    // update student progress tests 
    test('should update student progress successfully', async () => {
        const response: FirestoreUtilResponse = await firestoreUtils.updateStudentProgress(
            'testUserId',
            'testQuestionId',
            'correctAnswer',
            'answerChosen',
            true
        );
        console.log('Response:', response);

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


    // get progress data tests 
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
    test('should return empty progress for valid user with no questions', async () => {
      
    
        const response = await firestoreUtils.getUserProgress('QNUdC5WwMnBGIJ5vpS3w');
    
        expect(response.type).toBe('success');
        expect(response.data).toEqual([]); // Ensure no progress is returned
        expect(response.details).toBe('User progress retrieved successfully');
    });
});