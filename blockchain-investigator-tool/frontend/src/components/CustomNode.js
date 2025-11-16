import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import "../styles/CustomNode.css";

const CustomNode = ({ data, id }) => {
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !data.canExpand) return;
    setLoading(true);
    try {
      await data.onLoadMore({ address: id, offset: data.offset || 50 });
    } finally {
      setLoading(false);
    }
  }, [id, data, loading]);

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} className="handle" />

      <div className="node-label">{data.label}</div>
      <div className="node-balance">{(data.balance / 1e8).toFixed(6)} BTC</div>

      {data.canExpand && (
        <button
          onClick={loadMore}
          disabled={loading}
          className={`load-more-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      )}

      <Handle type="source" position={Position.Right} className="handle" />
    </div>
  );
};

export default CustomNode;
