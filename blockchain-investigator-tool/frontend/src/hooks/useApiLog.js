import { useState, useCallback } from "react";

export default function useApiLog() {
  const [logs, setLogs] = useState([]);

  const log = useCallback((msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  return { logs, log, setLogs };
}
