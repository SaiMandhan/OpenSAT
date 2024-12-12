import supertest from 'supertest';
import app from '../server'; // Import the Express app from your server.ts file

const request = supertest(app);

describe('GET /get-recommendation', () => {
    test('should return error for missing parameter', async () => {
        const response = await request.get('/get-recommendation');

        expect(response.status).toBe(400); // Bad request
        expect(response.text).toBe('Question ID is a required string');
    });

    test('should return default recommendation for valid request', async () => {
        const response = await request.get('/get-recommendation').query({
            questionId: '7ouUbiy6mBbopNScdZo5',
        });

        expect(response.status).toBe(200); // Successful response
        expect(response.body).toMatchObject({
            recommendation: '12345678', // Mocked response from the server
        });
    });
});
