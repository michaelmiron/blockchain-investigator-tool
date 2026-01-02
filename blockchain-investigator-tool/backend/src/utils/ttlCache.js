/**
 * Tiny in-memory TTL cache with max-size eviction (oldest first).
 * - Uses Map insertion order for eviction.
 * - Stores values only (no serialization).
 */
class TtlCache {
  /**
   * @param {{ ttlMs: number, max: number }} options
   */
  constructor({ ttlMs, max }) {
    this.ttlMs = Math.max(0, Number(ttlMs) || 0);
    this.max = Math.max(1, Number(max) || 1);
    /** @type {Map<string, { value: any, expiresAt: number }>} */
    this.map = new Map();
  }

  /**
   * @param {string} key
   */
  get(key) {
    const entry = this.map.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt <= Date.now()) {
      this.map.delete(key);
      return undefined;
    }

    // touch to keep recent entries longer (LRU-ish)
    this.map.delete(key);
    this.map.set(key, entry);

    return entry.value;
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    const expiresAt = Date.now() + this.ttlMs;
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expiresAt });

    while (this.map.size > this.max) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
  }
}

module.exports = TtlCache;

