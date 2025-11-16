const express = require('express');
const router = express.Router();
const BlockchainService = require('../services/blockchainService');

router.get('/address/:addr', async (req, res, next) => {
  const { limit = 50, offset = 0 } = req.query;
  try {
    const data = await BlockchainService.getAddress(req.params.addr, limit, offset);
    res.json(data);
  } catch (err) {
    next(err); 
  }
});

module.exports = router;