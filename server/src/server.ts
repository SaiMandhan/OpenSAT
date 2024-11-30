import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

interface FirestoreUtilResponse {
    type: 'success' | 'failure' | 'unauthorized',
    data: any,
    details: string,
}

app.get('/get-progress-data', async (req, res) => {
    try {
        const userType: any = req.query.userType;
        const userId: any = req.query.userId;

        if (typeof userType !== 'string' || userType === '') {
            res.status(400).send('User type is a required string');
        } else if (typeof userId !== 'string' || userId === '') {
            res.status(400).send('User ID is a required string');
        }

        // MOCK DATA
        // TODO: Update
        const firestoreRes: FirestoreUtilResponse = {
            type: 'success',
            data: {
                progress: {
                    dates: ['2021-01-01', '2021-01-02', '2021-01-03'],
                    scores: [60, 78, 81],
                },
            },
            details: ''
        };

        if (firestoreRes.type === 'unauthorized') {
            res.status(401).send("User type " + userType + " is unauthorized to access user " + userId + "'s progress");
        } else if (firestoreRes.type === 'success') {
            res.status(200).send(firestoreRes.data.progress)
        } else {
            res.status(500).send('Error fetching data: ' + firestoreRes.details);
        }
    } catch (error) {
        console.log("Error sending progress data: ", error)
        res.status(500).send('Error fetching data');
    }
});

app.get('/get-recommendation', async (req, res) => {
    try {
        const questionId: any = req.query.questionId;

        if (typeof questionId !== 'string' || questionId === '') {
            res.status(400).send('Question ID is a required string');
        }

        // MOCK DATA
        // TODO: Update with recommendation system
        try {
            const modelResponse: string = '12345678';
        } catch (error) {
            console.log('Recommendation system error: ', error);
            res.status(500).send('Error getting recommendation from AI model');
        }
    } catch (error) {
        console.log("Error getting recommendation: ", error)
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});