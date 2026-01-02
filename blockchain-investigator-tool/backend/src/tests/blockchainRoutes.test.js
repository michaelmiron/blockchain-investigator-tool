const request = require('supertest');
const express = require('express');
const blockchainRoutes = require('../routes/blockchain');
const errorHandler = require('../middleware/errorHandler');

jest.mock('axios');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use('/api/blockchain', blockchainRoutes);
app.use(errorHandler);

describe('Blockchain API Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('GET /api/blockchain/address/:addr - valid address', async () => {
    const validAddress = '1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F';

    axios.get.mockResolvedValueOnce({
      data: {
        address: validAddress,
        final_balance: 123,
        n_tx: 2,
        total_received: 456,
        total_sent: 333,
        txs: [{ hash: "tx1" }, { hash: "tx2" }],
      },
    });

    const response = await request(app).get(`/api/blockchain/address/${validAddress}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('address');
    expect(response.headers['x-cache']).toBe('MISS');
  });

  test('GET /api/blockchain/address/:addr - invalid address returns 400', async () => {
    const invalidAddress = '123INVALID';

    const response = await request(app).get(`/api/blockchain/address/${invalidAddress}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('GET /api/blockchain/address/:addr with limit & offset', async () => {
    const validAddress = '1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F';

    axios.get.mockResolvedValueOnce({
      data: {
        address: validAddress,
        final_balance: 123,
        n_tx: 2,
        total_received: 456,
        total_sent: 333,
        txs: [{ hash: "tx1" }],
      },
    });

    const response = await request(app)
      .get(`/api/blockchain/address/${validAddress}?limit=5&offset=5`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('txs');
    expect(Array.isArray(response.body.txs)).toBe(true);
  });

  test('GET /api/blockchain/address/:addr - cache hit avoids upstream', async () => {
    const validAddress = '1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F';

    axios.get.mockResolvedValueOnce({
      data: {
        address: validAddress,
        final_balance: 999,
        n_tx: 1,
        total_received: 999,
        total_sent: 0,
        txs: [{ hash: "tx-cache" }],
      },
    });

    const first = await request(app).get(`/api/blockchain/address/${validAddress}?limit=10&offset=0`);
    expect(first.status).toBe(200);
    expect(first.headers['x-cache']).toBe('MISS');

    const second = await request(app).get(`/api/blockchain/address/${validAddress}?limit=10&offset=0`);
    expect(second.status).toBe(200);
    expect(second.headers['x-cache']).toBe('HIT');

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

});
