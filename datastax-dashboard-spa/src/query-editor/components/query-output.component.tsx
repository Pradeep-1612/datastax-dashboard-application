import {
  defaultEditorOptions,
  MONACO_THEME,
} from "../../utilities/monaco-theme";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { selectQueryExecutionTime, selectQueryResult } from "../store/reducer";
import "./query-output.component.css";

const QueryOutputComponent: React.FC = () => {
  const queryExecutionTime = useSelector(selectQueryExecutionTime);
  const queryResult = useSelector(selectQueryResult);
  return (
    <div className="query-output-container">
      <div className="flex-between">
        <h6>Results</h6>
        <span className="result-summary__fetch-time">
          Fetched in {(queryExecutionTime / 1000).toFixed(2)}s
        </span>
      </div>
      <br></br>
      <div>
        <Editor
          height="400px"
          defaultLanguage="json"
          theme={MONACO_THEME}
          value={queryResult}
          options={{
            ...defaultEditorOptions,
            readOnly: true,
          }}
        />
      </div>
    </div>
  );
};

export default QueryOutputComponent;
