const axios = require('axios');
require('dotenv').config();

const API = 'https://blockchain.info'; 
const TtlCache = require('../utils/ttlCache');

const ADDRESS_CACHE_TTL_MS = Number(process.env.ADDRESS_CACHE_TTL_MS || 60_000);
const ADDRESS_CACHE_MAX = Number(process.env.ADDRESS_CACHE_MAX || 500);

// cache rawaddr responses (address + pagination)
const addressCache = new TtlCache({
  ttlMs: ADDRESS_CACHE_TTL_MS,
  max: ADDRESS_CACHE_MAX,
});

// in-flight de-dupe (prevents request stampedes for same key)
const inFlight = new Map();

class BlockchainService {
  static async getAddress(address, limit = 50, offset = 0) {
    try {
      const cacheKey = `rawaddr:${address}:${limit}:${offset}`;

      const cached = addressCache.get(cacheKey);
      if (cached) {
        return { data: cached, cache: "HIT" };
      }

      const existingPromise = inFlight.get(cacheKey);
      if (existingPromise) {
        const data = await existingPromise;
        return { data, cache: "COALESCED" };
      }

      const url = `${API}/rawaddr/${address}?limit=${limit}&offset=${offset}&cors=true`;
      const p = (async () => {
        const { data } = await axios.get(url);

        // REAL validation
        if (!data || typeof data !== "object" || data.address !== address) {
          throw new Error("Address not found or invalid");
        }

        const normalized = {
          address: data.address,
          final_balance: data.final_balance,
          n_tx: data.n_tx,
          total_received: data.total_received,
          total_sent: data.total_sent,
          txs: data.txs || [],
        };

        addressCache.set(cacheKey, normalized);
        return normalized;
      })();

      inFlight.set(cacheKey, p);
      try {
        const normalized = await p;
        return { data: normalized, cache: "MISS" };
      } finally {
        inFlight.delete(cacheKey);
      }

    } catch (error) {
      if (error.response) {
        console.log("ERROR STATUS:", error.response?.status);
        console.log("ERROR DATA:", error.response?.data);

        throw new Error(
          
          `API Error ${error.response.status}: ${error.response.data?.error || "Unknown"}`
        );
      }

      throw new Error(`Network error: ${error.message}`);
    }
  }


  static async getTransaction(txHash) {
    try {
      const url = `${API}/rawtx/${txHash}?cors=true`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      throw new Error(`Tx fetch error: ${error.message}`);
    }
  }

  static async getBalance(address) {
    try {
      const url = `${API}/balance?active=${address}&cors=true`;
      const { data } = await axios.get(url);
      return data[address] || { final_balance: 0, n_tx: 0, total_received: 0 };
    } catch (error) {
      throw new Error(`Balance error: ${error.message}`);
    }
  }
}

module.exports = BlockchainService;