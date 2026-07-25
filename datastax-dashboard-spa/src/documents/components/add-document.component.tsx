import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { Modal } from "@carbon/react";
import "../../assets/styles/common-styles.css";
import {
  defaultEditorOptions,
  MONACO_THEME,
} from "../../utilities/monaco-theme";
import {
  documentsActions,
  selectCreatePending,
  selectIsAddDocumentRequested,
  selectAddDocumentRequestBody,
} from "../store/reducer";
import { addDocument } from "../store/effects";
import type { AppDispatch } from "../../StoreConfiguration";

const formattedJsonPlaceholder = `${JSON.stringify(
  {
    _id: "your-id",
    name: "your-name",
    age: 20,
    active: true,
    another_field: "another_value",
    message: "Replace these example values with your own data",
  },
  null,
  2,
)}`;

const AddDocumentComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isCreatePending = useSelector(selectCreatePending);
  const isAddDocumentRequested = useSelector(selectIsAddDocumentRequested);
  const jsonContent = useSelector(selectAddDocumentRequestBody);

  const [jsonError, setJsonError] = useState("");

  // Validate JSON and check for _id field
  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) {
      setJsonError("JSON content is required");
      return false;
    }

    try {
      const parsed = JSON.parse(jsonString);

      // Check if _id field exists
      if (!parsed._id) {
        setJsonError("JSON must contain an '_id' field");
        return false;
      }

      setJsonError("");
      return true;
    } catch {
      setJsonError("Invalid JSON format");
      return false;
    }
  };

  // Handle Add button click
  const handleAdd = async () => {
    const isJsonValid = validateJson(jsonContent);

    if (!isJsonValid) {
      console.log("Invalid ID or JSON");
      return;
    }

    try {
      // Parse the JSON content
      const parsedJson = JSON.parse(jsonContent);

      // Call the document service - this will dispatch addDocumentSuccess on completion
      dispatch(addDocument(parsedJson));

      // Note: Request body will be cleared and modal will close automatically
      // when addDocumentSuccess is dispatched from the addDocument effect after successful completion
    } catch (error) {
      console.error("Error adding document:", error);
      setJsonError("Failed to add document. Please try again.");
    }
  };

  // Handle modal close
  const handleClose = () => {
    setJsonError("");
    dispatch(documentsActions.addDocumentSuccess());
  };

  // Handle JSON content change
  const handleJsonChange = (value: string | undefined) => {
    const newValue = value ?? "";
    dispatch(documentsActions.setAddDocumentRequestBody(newValue));
    if (jsonError) {
      validateJson(newValue);
    }
  };

  return (
    <Modal
      open={isAddDocumentRequested}
      onRequestClose={handleClose}
      modalHeading="Add new document"
      primaryButtonText="Add"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleAdd}
      onSecondarySubmit={handleClose}
      primaryButtonDisabled={isCreatePending}
      size="md"
    >
      <div className="field-wrapper">
        <span className="label">JSON Content</span>
        <div className={jsonError && "editor-border--error"}>
          <Editor
            height="400px"
            defaultLanguage="json"
            theme={MONACO_THEME}
            defaultValue={formattedJsonPlaceholder}
            value={jsonContent}
            onChange={handleJsonChange}
            options={{
              ...defaultEditorOptions,
              readOnly: isCreatePending,
            }}
          />
        </div>
        {jsonError && <span className="text-error">{jsonError}</span>}
      </div>
    </Modal>
  );
};

export default AddDocumentComponent;
