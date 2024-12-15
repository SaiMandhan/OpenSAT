import request from 'supertest';
import app from '../server';

describe('GET /get-recommendation', () => {
    test('should return error for missing parameter', async () => {
        const response = await request(app).get('/get-recommendation').expect(200);

        expect(response.status).toBe(400); // Bad request
        expect(response.text).toBe('Question ID is a required string');
    });

    test('should return a recommendation for valid request', async () => {
        const response = await request(app).get('/get-recommendation').query({
            questionId: '281a4f3b',
        });

        expect(response.status).toBe(200); // Successful response
        expect(response.body).toHaveProperty("recommendation");
    });
});
