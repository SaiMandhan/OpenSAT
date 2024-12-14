import express from 'express';
import * as admin from 'firebase-admin';
import { FirestoreUtils, FirestoreUtilResponse } from './FirestoreUtils';
import path from 'path';

const app = express();
const port = 3000;

// Parse JSON body (for POST requests)
app.use(express.json());

// Load service account key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// Instantiate FirestoreUtils with the Firestore instance
const firestoreUtils = new FirestoreUtils(db);

interface RegisterRequestBody {
  username: string;
  password: string;
}

// Register a user (GET request, just like before)

app.get('/register', async (req: any, res: any) => {
  try {
    const username: any = req.query.username;
    const password: any = req.query.password;

    if (!username || !password) {
      return res.status(400).send({ error: 'Username and password are required' });
    }

    // Check if username is taken by querying Firestore
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.where('username', '==', username).get();

    if (!userSnapshot.empty) {
      return res.status(400).send({ error: 'Username is already taken' });
    }

    // Username not taken, create new user
    const newUserRef = usersRef.doc();
    await newUserRef.set({
      username,
      password
    });
    console.log("Wrote user to Firestore with ID:", newUserRef.id);

    res.status(201).send({ message: 'Registration successful', userId: newUserRef.id });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Get progress data

app.get('/get-progress-data', async (req: any, res: any) => {
  try {
    const userType: any = req.query.userType;
    const userId: any = req.query.userId;

    if (typeof userType !== 'string' || userType === '') {
      return res.status(400).send('User type is a required string');
    } 
    if (typeof userId !== 'string' || userId === '') {
      return res.status(400).send('User ID is a required string');
    }

    // Use FirestoreUtils to get actual data from Firestore
    const firestoreRes: FirestoreUtilResponse = await firestoreUtils.getUserProgress(userId);

    if (firestoreRes.type === 'unauthorized') {
      res.status(401).send("User type " + userType + " is unauthorized to access user " + userId + "'s progress");
    } else if (firestoreRes.type === 'success') {
      res.status(200).send(firestoreRes.data);
    } else {
      res.status(500).send('Error fetching data: ' + firestoreRes.details);
    }
  } catch (error) {
    console.log("Error sending progress data: ", error);
    res.status(500).send('Error fetching data');
  }
});

// Get recommendation (still mock for now)

app.get('/get-recommendation', async (req: any, res: any) => {
  try {
    const questionId: any = req.query.questionId;

    if (typeof questionId !== 'string' || questionId === '') {
      return res.status(400).send('Question ID is a required string');
    }

    // Still mock data for recommendation
    const modelResponse: string = '12345678';
    res.status(200).send({ recommendation: modelResponse });
  } catch (error) {
    console.log("Error getting recommendation: ", error);
    res.status(500).send('Error fetching data');
  }
});


app.post('/update-progress-data', async (req: any, res: any) => {
  try {
    const userId: any = req.body.userId;
    const questionId: any = req.body.questionId;
    const correctAnswer: any = req.body.correctAnswer;
    const answerChosen: any = req.body.answerChosen;
    const correct: any = req.body.correct;

    if (typeof questionId !== 'string' || questionId === '') {
      return res.status(400).send('Question ID is a required string');
    } else if (typeof correct !== 'boolean') {
      return res.status(400).send('Correct must be a boolean');
    }

    const firestoreRes: FirestoreUtilResponse = await firestoreUtils.updateStudentProgress(
      userId,
      questionId,
      correctAnswer,
      answerChosen,
      correct
    );

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
app.get('/student-accuracy', async (req: any, res: any) => {
  try {
      const userId: string = req.query.userId as string;
      const timeframe: 'week' | 'month' = req.query.timeframe as 'week' | 'month';

      if (!userId || !timeframe) {
          return res.status(400).send('User ID and timeframe are required');
      }

      const firestoreRes = await firestoreUtils.getStudentAccuracy(userId, timeframe);

      if (firestoreRes.type === 'success') {
          res.status(200).send(firestoreRes.data);
      } else {
          res.status(500).send('Error fetching accuracy: ' + firestoreRes.details);
      }
  } catch (error) {
      console.error('Error fetching student accuracy:', error);
      res.status(500).send('Internal server error');
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
export default app; 