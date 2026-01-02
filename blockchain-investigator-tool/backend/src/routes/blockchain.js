const express = require('express');
const router = express.Router();
const BlockchainService = require('../services/blockchainService');
const HttpError = require('../utils/httpError');

function isValidBtcAddress(addr) {
  // supports common legacy/base58 + bech32 (bc1...) forms
  if (typeof addr !== "string") return false;
  const a = addr.trim();
  if (!a) return false;
  if (/^bc1[ac-hj-np-z02-9]{11,71}$/i.test(a)) return true;
  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(a)) return true;
  return false;
}

function parsePagination(query) {
  const limitRaw = query.limit ?? 50;
  const offsetRaw = query.offset ?? 0;

  const limit = Number(limitRaw);
  const offset = Number(offsetRaw);

  // blockchain.info rawaddr allows up to 50, but we accept <= 200 and clamp to 50 for safety.
  if (!Number.isFinite(limit) || !Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new HttpError(400, "Invalid 'limit'. Must be an integer between 1 and 200.");
  }
  if (!Number.isFinite(offset) || !Number.isInteger(offset) || offset < 0 || offset > 200_000) {
    throw new HttpError(400, "Invalid 'offset'. Must be a non-negative integer.");
  }

  // Upstream supports max 50 per page; keep behavior predictable and avoid 400/429 upstream.
  return { limit: Math.min(limit, 50), offset };
}

router.get('/address/:addr', async (req, res, next) => {
  try {
    const address = req.params.addr;
    if (!isValidBtcAddress(address)) {
      throw new HttpError(400, "Invalid Bitcoin address. Please enter a correct BTC address.");
    }

    const { limit, offset } = parsePagination(req.query);

    const result = await BlockchainService.getAddress(address, limit, offset);
    res.set("X-Cache", result.cache);
    res.json(result.data);
  } catch (err) {
    next(err); 
  }
});

module.exports = router;