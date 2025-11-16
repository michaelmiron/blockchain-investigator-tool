import React from "react";
import "../styles/AddressInput.css";

export default function AddressInput({
  address,
  setAddress,
  txLimit,
  setTxLimit,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="address-form">
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Bitcoin address"
        className="address-input"
      />

      <input
        type="number"
        value={txLimit}
        onChange={(e) => setTxLimit(e.target.value)}
        placeholder="Number of wallets"
        className="limit-input"
      />

      <button type="submit" className="investigate-btn">
        Investigate
      </button>
    </form>
  );
}
