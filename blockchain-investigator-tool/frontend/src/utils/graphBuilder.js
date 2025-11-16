import { MarkerType } from "reactflow";

export function mergeNodes(existing, incoming) {
  const map = new Map(existing.map((n) => [n.id, n]));

  (incoming || []).forEach((node) => {
    const prev = map.get(node.id);

    if (prev) {
      map.set(node.id, {
        ...prev,
        data: {
          ...prev.data,
          ...node.data,
        },
      });
    } else {
      map.set(node.id, node);
    }
  });

  return [...map.values()];
}

export function buildGraph({
  center,
  txs,
  onLoadMore,
  includeCenter,
  nextOffset,
}) {
  const nodeMap = new Map();
  const edges = [];

  if (includeCenter) {
    nodeMap.set(center, {
      id: center,
      type: "custom",
      position: { x: 400, y: 200 },
      data: {
        label: center.slice(0, 10) + "...",
        balance: 0,
        canExpand: true,
        offset: nextOffset,
        onLoadMore,
      },
    });
  }

  (txs || []).forEach((tx) => {
    (tx.inputs || []).forEach((input) => {
      const from = input.prev_out?.addr;
      const value = input.prev_out?.value;

      if (!from) return;
      if (typeof value !== "number" || value <= 0) return;
      if (from === center) return;

      if (!nodeMap.has(from)) {
        nodeMap.set(from, {
          id: from,
          type: "custom",
          position: { x: 100 + Math.random() * 200, y: Math.random() * 500 },
          data: {
            label: from.slice(0, 10) + "...",
            balance: value,
            canExpand: true,
            offset: 0,
            onLoadMore,
          },
        });
      }

      edges.push({
        id: `${from}-${tx.hash}`,
        source: from,
        target: center,
        label: `${(value / 1e8).toFixed(4)} BTC`,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 25,
          height: 25,
          color: "#000000",
        },
      });
    });

    (tx.out || []).forEach((out) => {
      const to = out.addr;
      const value = out.value;

      if (!to) return;
      if (typeof value !== "number" || value <= 0) return;
      if (to === center) return;

      if (!nodeMap.has(to)) {
        nodeMap.set(to, {
          id: to,
          type: "custom",
          position: { x: 600 + Math.random() * 200, y: Math.random() * 500 },
          data: {
            label: to.slice(0, 10) + "...",
            balance: value,
            canExpand: true,
            offset: 0,
            onLoadMore,
          },
        });
      }

      edges.push({
        id: `${center}-${tx.hash}-${to}`,
        source: center,
        target: to,
        label: `${(value / 1e8).toFixed(4)} BTC`,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 25,
          height: 25,
          color: "#000000",
        },
      });
    });
  });

  return {
    nodes: [...nodeMap.values()],
    edges,
  };
}
