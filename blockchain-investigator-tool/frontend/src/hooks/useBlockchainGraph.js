import { useState, useRef, useCallback } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { fetchAddress } from "../api";
import { buildGraph, mergeNodes } from "../utils/graphBuilder";

export default function useBlockchainGraph(log) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const txLimit = useRef(50);

  const setLimit = (val) => {
    txLimit.current = val;
  };

  const onLoadMore = useCallback(
    async ({ address, offset }) => {
      const limit = txLimit.current;
      log(`Loading more for ${address} (offset ${offset})`);

      try {
        const { data } = await fetchAddress(address, limit, offset);
        const txs = data.txs || [];

        setNodes((prev) =>
          prev.map((n) =>
            n.id === address
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    balance: data.final_balance,
                    canExpand: data.n_tx > offset + txs.length,
                    offset: offset + limit,
                  },
                }
              : n
          )
        );

        if (!txs.length) {
          log("No more transactions");
          return;
        }

        const g = buildGraph({
          center: address,
          txs,
          includeCenter: false,
          nextOffset: offset + limit,
          onLoadMore,
        });

        setNodes((prev) => mergeNodes(prev, g.nodes));
        setEdges((prev) => [...prev, ...g.edges]);

        log(`Loaded ${txs.length} new txs`);
      } catch (err) {
        const msg = err.message;
        setError(msg);
        log(`Load more failed: ${msg}`);
      }
    },
    [log]
  );

  const submit = async (address) => {
    if (!address) return;

    log(`Fetching ${address}`);
    setLoading(true);
    setError(null);

    try {
      const limit = txLimit.current;
      const { data } = await fetchAddress(address, limit, 0);
      const txs = data.txs || [];

      if (!txs.length) {
        log("No transactions found");
        setLoading(false);
        return;
      }

      const g = buildGraph({
        center: address,
        txs,
        includeCenter: true,
        nextOffset: limit,
        onLoadMore,
      });

      const updated = g.nodes.map((node) =>
        node.id === address
          ? {
              ...node,
              data: {
                ...node.data,
                balance: data.final_balance,
                canExpand: data.n_tx > txs.length,
              },
            }
          : node
      );

      setNodes(updated);
      setEdges(g.edges);
    } catch (err) {
      const msg = err.message;
      setError(msg);
      log(`Error: ${msg}`);
    }

    setLoading(false);
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    submit,
    loading,
    error,
    setError,
    selected,
    setSelected,
    setLimit,
  };
}
