import React from "react";
import "../styles/AddressDetails.css";

export default function AddressDetails({ node }) {
  if (!node) {
    return <i className="no-selection">Click a node to see details</i>;
  }

  return (
    <div className="details">
      <div>
        <strong>ID:</strong> {node.id}
      </div>
      <div>
        <strong>Label:</strong> {node.data.label}
      </div>
      <div>
        <strong>Balance:</strong> {(node.data.balance / 1e8).toFixed(6)} BTC
      </div>
    </div>
  );
}
