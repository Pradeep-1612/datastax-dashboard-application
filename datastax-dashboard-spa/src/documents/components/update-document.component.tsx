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
  selectUpdatePending,
  selectIsUpdateDocumentRequested,
  selectSelectedDocument,
  selectUpdateDocumentRequestBody,
} from "../store/reducer";
import { updateDocument } from "../store/effects";
import type { AppDispatch } from "../../StoreConfiguration";

const UpdateDocumentComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isUpdatePending = useSelector(selectUpdatePending);
  const isUpdateDocumentRequested = useSelector(
    selectIsUpdateDocumentRequested,
  );
  const selectedDocument = useSelector(selectSelectedDocument);
  const jsonContent = useSelector(selectUpdateDocumentRequestBody);

  const [jsonError, setJsonError] = useState("");

  // Validate JSON format only
  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) {
      setJsonError("JSON content is required");
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

  // Handle Update button click
  const handleUpdate = async () => {
    const isJsonValid = validateJson(jsonContent);

    if (!isJsonValid) {
      console.log("Invalid JSON");
      return;
    }

    try {
      // Parse the JSON content
      const parsedJson = JSON.parse(jsonContent);

      // Call the document service with _id appended
      dispatch(updateDocument(selectedDocument._id, parsedJson));

      // Note: Modal will close automatically when updateDocumentSuccess is dispatched
      // from the updateDocument effect after successful completion
    } catch (error) {
      console.error("Error updating document:", error);
      setJsonError("Failed to update document. Please try again.");
    }
  };

  // Handle modal close
  const handleClose = () => {
    setJsonError("");
    dispatch(documentsActions.updateDocumentSuccess());
  };

  // Handle JSON content change
  const handleJsonChange = (value: string | undefined) => {
    const newValue = value ?? "";
    dispatch(documentsActions.setUpdateDocumentRequestBody(newValue));
    if (jsonError) {
      validateJson(newValue);
    }
  };

  return (
    <Modal
      open={isUpdateDocumentRequested}
      onRequestClose={handleClose}
      modalHeading={"_id: " + selectedDocument?._id}
      modalLabel="Update document"
      primaryButtonText="Update"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleUpdate}
      onSecondarySubmit={handleClose}
      primaryButtonDisabled={isUpdatePending}
      size="md"
    >
      <div className="field-wrapper">
        <span className="label">JSON Content</span>
        <div className={jsonError && "editor-border--error"}>
          <Editor
            height="400px"
            defaultLanguage="json"
            theme={MONACO_THEME}
            value={jsonContent}
            onChange={handleJsonChange}
            options={{
              ...defaultEditorOptions,
              readOnly: isUpdatePending,
            }}
          />
        </div>
        {jsonError && <span className="text-error">{jsonError}</span>}
      </div>
    </Modal>
  );
};

export default UpdateDocumentComponent;
