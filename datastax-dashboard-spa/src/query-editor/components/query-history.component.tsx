import React from "react";
import { useSelector } from "react-redux";
import { CodeSnippet } from "@carbon/react";
import { selectQueryExecutionTime } from "../store/reducer";
import { getQueryHistory } from "../../utilities/device-store";
import "./query-history.component.css";

const QueryHistory: React.FC = () => {
  useSelector(selectQueryExecutionTime); // re-render when a query completes

  const history = getQueryHistory();

  if (history.length === 0) {
    return <p className="query-history-empty">No queries run yet.</p>;
  }

  return (
    <div className="query-history-list">
      <p className="query-history-note">Stores up to 20 recent queries.</p>
      {[...history].reverse().map((entry, index) => (
        <div key={index} className="query-history-item">
          <div className="query-history-header">
            <span className="query-history-timestamp">
              {new Date(entry.lastRunAt).toLocaleString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
            <span className="query-history-execution-time">
              {(entry.executionTime / 1000).toFixed(2)} s
            </span>
          </div>
          <CodeSnippet
            type="multi"
            feedback="Copied!"
            className={entry.success ? "bl-light--success" : "bl-light--error"}
          >
            {entry.query}
          </CodeSnippet>
        </div>
      ))}
    </div>
  );
};

export default QueryHistory;
