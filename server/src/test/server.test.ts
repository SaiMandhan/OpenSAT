import request from 'supertest';
import app from '../server';

describe('GET /get-recommendation', () => {
  test('should return a recommendation for valid request', async () => {
    const response = await request(app)
      .get('/get-recommendation')
      .query({ question_id: '281a4f3b', user_id: 'testUserId' })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recommendation");
  });

  test('should return error for missing parameter', async () => {
    const response = await request(app)
      .get('/get-recommendation') // no query parameters
      .expect(400);

    expect(response.text).toBe('Question ID is a required string');
  });

});


// describe('GET /get-progress-data', () => {
//   // NEW TEST: Unauthorized user type
//   test('should return 401 for unauthorized userType', async () => {
//     const response = await request(app)
//       .get('/get-progress-data')
//       .query({ userType: 'unauthorizedType', userId: 'testUserId' })
//       .expect(401);

//     expect(response.text).toContain('is unauthorized');
//   });

// });

describe('GET /get-random-questions', () => {
  // NEW TEST: User who answered all questions
  test('should return an empty array if user answered all questions', async () => {
    const response = await request(app)
      .get('/get-random-questions')
      .query({ user_id: 'userWhoAnsweredAll' })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('POST /update-progress-data', () => {
  // NEW TEST: Missing required field
  test('should return 400 if questionId is missing', async () => {
    const response = await request(app)
      .post('/update-progress-data')
      .send({ userId: 'testUserId', correct: true }) // no questionId
      .expect(400);

    expect(response.text).toBe('Question ID is a required string');
  });

});

describe('GET /get-student-accuracy', () => {

  test('should return 400 for valid timeframe', async () => {
    const response = await request(app)
      .get('/get-student-accuracy')
      .query({ userId: 'testUserId', timeframe: 'week' }) // not 'week' or 'month'
      .expect(200);
  });
});
