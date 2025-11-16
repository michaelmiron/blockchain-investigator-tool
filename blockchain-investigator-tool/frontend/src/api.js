import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

export async function fetchAddress(address, limit = 50, offset = 0) {
  try {
    const res = await API.get(`/blockchain/address/${address}`, {
      params: { limit, offset },
    });
    return res;
  } catch (err) {
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
