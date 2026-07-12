import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, TextArea } from "@carbon/react";
import {
  documentsActions,
  selectUpdatePending,
  selectIsUpdateDocumentRequested,
  selectSelectedDocument,
  selectUpdateDocumentRequestBody
} from "../store/reducer";
import { updateDocument } from "../store/effects";
import type { AppDispatch } from "../../StoreConfiguration";

const UpdateDocumentComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isUpdatePending = useSelector(selectUpdatePending);
  const isUpdateDocumentRequested = useSelector(selectIsUpdateDocumentRequested);
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
    } catch (error) {
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
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(documentsActions.setUpdateDocumentRequestBody(e.target.value));
    if (jsonError) {
      validateJson(e.target.value);
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
      <div style={{ marginBottom: "1rem" }}>
        <TextArea
          id="json-content"
          labelText="JSON Content"
          placeholder={`Enter JSON content, e.g.:\n{\n  "_collection": "ssuser",\n  "name": "Pradeep J"\n}`}
          value={jsonContent}
          onChange={handleJsonChange}
          invalid={!!jsonError}
          invalidText={jsonError}
          rows={20}
          disabled={isUpdatePending}
        />
      </div>
    </Modal>
  );
};

export default UpdateDocumentComponent;

// Made with Bob
