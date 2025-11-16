import React from "react";
import ReactFlow, { MiniMap, Background } from "reactflow";
import "reactflow/dist/style.css";
import "../styles/GraphContainer.css";

export default function GraphContainer({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  nodeTypes,
}) {
  return (
    <div className="graph-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap nodeColor="#ffffff" nodeStrokeColor="#cc6600" />
        <Background color="#000000" />
      </ReactFlow>
    </div>
  );
}
