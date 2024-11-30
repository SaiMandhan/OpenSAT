import express,{ Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

interface FirestoreUtilResponse {
    type: 'success' | 'failure' | 'unauthorized',
    data: any,
    details: string,
}

const mockUsers: { [key: string]: { username: string; password: string } } = {
    user1: { username: 'user1', password: 'pass123' },
    user2: { username: 'user2', password: 'pass456' },
};

interface RegisterRequestBody {
    username: string;
    password: string;
  }
  
app.get('/register', async (req: any, res: any) => {
    try {
      const username: any = req.query.username;
      const password: any = req.query.password;
  
      if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' });
      }
  
      
      const isUsernameTaken = Object.values(mockUsers).some((user) => user.username === username);
  
      if (isUsernameTaken) {
        return res.status(400).send({ error: 'Username is already taken' });
      }
  
      const userId = `user${Object.keys(mockUsers).length + 1}`;
      mockUsers[userId] = { username, password };
  
      res.status(201).send({ message: 'Registration successful', userId });
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
});
  
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

app.post('/update-progress-data', async (req, res) => {
    try {
        const userId: any = req.body.userId;
        const questionId: any = req.body.questionId;
        const correct: any = req.body.correct;

        if (typeof questionId !== 'string' || questionId === '') {
            res.status(400).send('Question ID is a required string');
        } else if (typeof correct !== 'boolean') {
            res.status(400).send('Correct must be a boolean');
        }

        // MOCK DATA
        // TODO: Update with actual Firestore update logic
        const firestoreRes: FirestoreUtilResponse = {
            type: 'success',
            data: {},
            details: ''
        };

        if (firestoreRes.type === 'success') {
            res.status(200).send('Progress updated successfully');
        } else {
            res.status(500).send('Error updating data: ' + firestoreRes.details);
        }
    } catch (error) {
        console.log("Error updating progress data: ", error);
        res.status(500).send('Error updating data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});