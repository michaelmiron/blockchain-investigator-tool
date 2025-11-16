const request = require('supertest');
const express = require('express');
const blockchainRoutes = require('../routes/blockchain');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/blockchain', blockchainRoutes);
app.use(errorHandler);

describe('Blockchain API Basic Tests', () => {
  
  test('GET /api/blockchain/address/:addr - valid address', async () => {
    const validAddress = '1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F';

    const response = await request(app).get(`/api/blockchain/address/${validAddress}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('address');
  });

  test('GET /api/blockchain/address/:addr - invalid address returns 400', async () => {
    const invalidAddress = '123INVALID';

    const response = await request(app).get(`/api/blockchain/address/${invalidAddress}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

    test('GET /api/blockchain/address/:addr with limit & offset', async () => {
    const validAddress = '1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F';

    const response = await request(app)
      .get(`/api/blockchain/address/${validAddress}?limit=5&offset=5`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('txs');
    expect(Array.isArray(response.body.txs)).toBe(true);
  });

});
