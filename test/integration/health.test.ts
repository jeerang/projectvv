import request from 'supertest';
import { createApp } from '../../src/app';

describe('Integration: Health check endpoint', () => {
  const app = createApp();

  it('GET / returns 200 with OK status and message', async () => {
    // Act
    const res = await request(app).get('/');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'OK',
      message: 'Election System API is running',
    });
  });
});
