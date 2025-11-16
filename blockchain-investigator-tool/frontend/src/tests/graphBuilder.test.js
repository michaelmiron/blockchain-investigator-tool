import { buildGraph } from "../utils/graphBuilder";

test("ignores zero-value outputs", () => {
  const { nodes, edges } = buildGraph({
    center: "AAA",
    txs: [
      {
        inputs: [],
        out: [
          { addr: "BBB", value: 0 }, 
          { addr: "CCC", value: 20000 } 
        ]
      }
    ],
    onLoadMore: () => {},
    includeCenter: true,
    nextOffset: 0
  });

  expect(nodes.length).toBe(2); 
  expect(edges.length).toBe(1);
});
