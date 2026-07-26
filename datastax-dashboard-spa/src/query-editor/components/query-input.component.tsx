import { useState } from "react";
import {
  defaultEditorOptions,
  MONACO_THEME,
} from "../../utilities/monaco-theme";
import { Editor } from "@monaco-editor/react";
import { Button, ButtonSkeleton } from "@carbon/react";
import { PlayFilledAlt } from "@carbon/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { queryEditorActions, selectQueryExecuting, selectQueryInput } from "../store/reducer";
import { executeQuery } from "../store/effects";
import type { AppDispatch } from "../../StoreConfiguration";

const QueryInputComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isQueryRunning = useSelector(selectQueryExecuting);
  const jsonContent = useSelector(selectQueryInput);

  const [jsonError, setJsonError] = useState("");

  // Validate JSON and check for _id field
  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) {
      setJsonError("Query JSON is required");
      return false;
    }

    try {
      JSON.parse(jsonString);
      setJsonError("");
      return true;
    } catch {
      setJsonError("Invalid JSON format");
      return false;
    }
  };

  // Handle JSON content change
  const handleJsonChange = (value: string | undefined) => {
    const newValue = value ?? "";
    dispatch(queryEditorActions.setQueryInput(newValue));
    if (jsonError) {
      validateJson(newValue);
    }
  };

  // Handle Search button click
  const handleSearch = async () => {
    const isJsonValid = validateJson(jsonContent);

    if (!isJsonValid) {
      console.log("Invalid ID or JSON");
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonContent);
      dispatch(executeQuery(parsedJson));
    } catch (error) {
      console.error("Error executing query:", error);
      setJsonError("Failed to execute query. Please try again.");
    }
  };
  return (
    <>
      <h6>Query editor</h6>
      <br></br>
      <div className={jsonError && "editor-border--error"}>
        <Editor
          className="bs-light"
          height="300px"
          defaultLanguage="json"
          theme={MONACO_THEME}
          value={jsonContent}
          onChange={handleJsonChange}
          options={{
            ...defaultEditorOptions,
            readOnly: isQueryRunning,
          }}
        />
      </div>
      {jsonError && <span className="text-error">{jsonError}</span>}
      <br></br>
      <div className="flex">
        {isQueryRunning ? (
          <ButtonSkeleton className="ml-auto" />
        ) : (
          <Button
            className="ml-auto"
            onClick={handleSearch}
            renderIcon={PlayFilledAlt}
            size="sm"
            disabled={isQueryRunning}
          >
            Execute
          </Button>
        )}
      </div>
    </>
  );
};

export default QueryInputComponent;
