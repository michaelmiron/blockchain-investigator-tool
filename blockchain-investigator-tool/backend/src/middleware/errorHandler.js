module.exports = (err, req, res, next) => {
  console.error("Backend error:", err.message);

  if (err.message.includes("Address not found") || err.message.includes("invalid")) {
    return res.status(400).json({
      error: "Invalid Bitcoin address. Please enter a correct BTC address."
    });
  }

  if (err.message.includes("429")) {
    return res.status(429).json({
      error: "Blockchain.com API rate limit reached. Please wait a few seconds and try again."
    });
  }

  if (err.message.includes("Network")) {
    return res.status(503).json({
      error: "Blockchain.com API unreachable. Please try again later."
    });
  }

  return res.status(500).json({
    error: err.message || "Internal Server Error"
  });
};
