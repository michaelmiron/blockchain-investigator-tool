import React from "react";
import "../styles/ApiLogPanel.css";

export default function ApiLogPanel({ logs, collapsed, toggle }) {
  return (
    <div className="log-panel">
      <button onClick={toggle} className="log-toggle">
        {collapsed ? "▶" : "▼"} API Log ({logs.length})
      </button>
      {!collapsed && (
        <pre className="log-content">
          {logs.length ? logs.join("\n") : "No API calls yet."}
        </pre>
      )}
    </div>
  );
}
