
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
    async getStudentAccuracy(userId: string, timeframe: 'week' | 'month'): Promise<FirestoreUtilResponse> {
        try {
            const now = new Date();
            const startDate = new Date();

            // Calculate start date based on timeframe
            if (timeframe === 'week') {
                startDate.setDate(now.getDate() - 7);
            } else if (timeframe === 'month') {
                startDate.setMonth(now.getMonth() - 1);
            }

            const questionsRef = this.firestore
                .collection('users')
                .doc(userId)
                .collection('questions');
            const snapshot = await questionsRef
                .where('answered', '>=', startDate)
                .get();

            if (snapshot.empty) {
                return {
                    type: 'success',
                    data: { averageAccuracy: 0 },
                    details: 'No questions found for the given timeframe',
                };
            }

            // Calculate accuracy
            let correctAnswers = 0;
            let totalQuestions = 0;

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.correct !== undefined) {
                    totalQuestions += 1;
                    if (data.correct) {
                        correctAnswers += 1;
                    }
                }
            });

            const averageAccuracy = totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;

            return {
                type: 'success',
                data: { averageAccuracy },
                details: 'Student accuracy calculated successfully',
            };
        } catch (error: any) {
            return {
                type: 'failure',
                data: null,
                details: `Error calculating student accuracy: ${error.message}`,
            };
        }

    }
}

export default FirestoreUtils;
