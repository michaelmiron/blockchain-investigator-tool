import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// Lightweight client-side cache to avoid hammering our backend
const CACHE_TTL_MS = 30_000;
const CACHE_MAX = 200;
const cache = new Map(); // key -> { expiresAt, data }
const inFlight = new Map(); // key -> Promise<{data:any}>

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }
  // touch (LRU-ish)
  cache.delete(key);
  cache.set(key, entry);
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  while (cache.size > CACHE_MAX) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

export async function fetchAddress(address, limit = 50, offset = 0, options = {}) {
  try {
    const key = `addr:${address}:${limit}:${offset}`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const existing = inFlight.get(key);
    if (existing) return await existing;

    const p = (async () => {
      const res = await API.get(`/blockchain/address/${address}`, {
        params: { limit, offset },
        signal: options.signal,
      });
      setCached(key, res.data);
      return { data: res.data };
    })();

    inFlight.set(key, p);
    try {
      return await p;
    } finally {
      inFlight.delete(key);
    }
  } catch (err) {
    if (err.code === "ERR_CANCELED") {
      throw err;
    }

    const backendMsg = err.response?.data?.error;

    const axiosMsg = err.message;

    let finalMessage = "Unknown error";

    if (backendMsg) {
      finalMessage = backendMsg;
    } else if (axiosMsg.includes("Network Error")) {
      finalMessage = "Cannot reach the server. Please try again later.";
    } else if (axiosMsg.includes("timeout")) {
      finalMessage = "Server timeout. Try again in a moment.";
    } else if (axiosMsg) {
      finalMessage = axiosMsg;
    }
    throw new Error(finalMessage);
  }
}
