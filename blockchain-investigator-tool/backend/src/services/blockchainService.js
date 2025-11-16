const axios = require('axios');
require('dotenv').config();

const API = 'https://blockchain.info'; 

class BlockchainService {
  static async getAddress(address, limit = 50, offset = 0) {
    try {
      const url = `${API}/rawaddr/${address}?limit=${limit}&offset=${offset}&cors=true`;
      console.log("Fetching from Blockchain.com:", url);

      const { data } = await axios.get(url);

      // REAL validation
      if (!data || typeof data !== "object" || data.address !== address) {
        throw new Error("Address not found or invalid");
  }

      return {
        address: data.address,
        final_balance: data.final_balance,
        n_tx: data.n_tx,
        total_received: data.total_received,
        total_sent: data.total_sent,
        txs: data.txs || [],
      };

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