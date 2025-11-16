import React, { useState } from "react";

import AddressInput from "./components/AddressInput";
import ApiLogPanel from "./components/ApiLogPanel";
import AddressDetails from "./components/AddressDetails";
import GraphContainer from "./components/GraphContainer";
import LoadingOverlay from "./components/LoadingOverlay";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomNode from "./components/CustomNode";

import useApiLog from "./hooks/useApiLog";
import useBlockchainGraph from "./hooks/useBlockchainGraph";

import "./App.css";
import "reactflow/dist/style.css";

const nodeTypes = { custom: CustomNode };

export default function App() {
  const { logs, log, setLogs } = useApiLog();

  const {
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
  } = useBlockchainGraph(log);

  const [address, setAddress] = useState("");
  const [limit, updateLimit] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    setLogs([]);
    setError(null);

    if (!address.trim()) {
      setError("Please enter a Bitcoin address.");
      return;
    }

    const num = Number(limit);
    if (!limit || isNaN(num) || num < 1 || num > 200) {
      setError("Please enter a number between 1 and 200.");
      return;
    }

    setLimit(num);
    submit(address);
  };

  const onLimitChange = (value) => updateLimit(value);

  return (
    <ErrorBoundary error={error} onClearError={() => setError(null)}>
      <div className="app-wrapper">
        <header className="header">
          <AddressInput
            address={address}
            setAddress={setAddress}
            txLimit={limit}
            setTxLimit={onLimitChange}
            onSubmit={onSubmit}
          />
        </header>

        <div className="main-layout">
          <div className="graph-wrapper">
            {loading && <LoadingOverlay />}
            <GraphContainer
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(_, n) => setSelected(n)}
              nodeTypes={nodeTypes}
            />
          </div>

          <aside className="sidebar">
            <ApiLogPanel
              logs={logs}
              collapsed={collapsed}
              toggle={() => setCollapsed(!collapsed)}
            />
            <h3 className="details-title">Address Details</h3>
            <AddressDetails node={selected} />
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
