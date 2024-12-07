
import { Firestore } from 'firebase-admin/firestore';

export interface FirestoreUtilResponse {
    type: 'success' | 'failure' | 'unauthorized';
    data: any;
    details: string;
}

export class FirestoreUtils {
    firestore: Firestore;

    constructor(db: Firestore) {
        this.firestore = db;
    }

    async updateStudentProgress(
        userId: string, 
        questionId: string, 
        correctAnswer: string, 
        answerChosen: string, 
        correct: boolean
    ): Promise<FirestoreUtilResponse> {
        try {
            const questionRef = this.firestore
                .collection('users')
                .doc(userId)
                .collection('questions');
            
            await questionRef.add({
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
            const questionsRef = this.firestore
                .collection('users')
                .doc(userId)
                .collection('questions');
            const questionsSnapshot = await questionsRef.get();
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
