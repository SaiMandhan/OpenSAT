"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/get-progress-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userType = req.query.userType;
        const userId = req.query.userId;
        if (typeof userType !== 'string' || userType === '') {
            res.status(400).send('User type is a required string');
        }
        else if (typeof userId !== 'string' || userId === '') {
            res.status(400).send('User ID is a required string');
        }
        // MOCK DATA
        // TODO: Update
        const firestoreRes = {
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
        }
        else if (firestoreRes.type === 'success') {
            res.status(200).send(firestoreRes.data.progress);
        }
        else {
            res.status(500).send('Error fetching data: ' + firestoreRes.details);
        }
    }
    catch (error) {
        console.log("Error sending progress data: ", error);
        res.status(500).send('Error fetching data');
    }
}));
app.get('/get-recommendation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.query.questionId;
        if (typeof questionId !== 'string' || questionId === '') {
            res.status(400).send('Question ID is a required string');
        }
        // MOCK DATA
        // TODO: Update with recommendation system
        try {
            const modelResponse = '12345678';
        }
        catch (error) {
            console.log('Recommendation system error: ', error);
            res.status(500).send('Error getting recommendation from AI model');
        }
    }
    catch (error) {
        console.log("Error getting recommendation: ", error);
        res.status(500).send('Error fetching data');
    }
}));
app.post('/update-progress-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const questionId = req.body.questionId;
        const correct = req.body.correct;
        if (typeof questionId !== 'string' || questionId === '') {
            res.status(400).send('Question ID is a required string');
        }
        else if (typeof correct !== 'boolean') {
            res.status(400).send('Correct must be a boolean');
        }
        // MOCK DATA
        // TODO: Update with actual Firestore update logic
        const firestoreRes = {
            type: 'success',
            data: {},
            details: ''
        };
        if (firestoreRes.type === 'success') {
            res.status(200).send('Progress updated successfully');
        }
        else {
            res.status(500).send('Error updating data: ' + firestoreRes.details);
        }
    }
    catch (error) {
        console.log("Error updating progress data: ", error);
        res.status(500).send('Error updating data');
    }
}));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
