import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  TextArea,
} from "@carbon/react";
import {
  documentsActions,
  selectCreatePending,
  selectIsAddDocumentRequested,
  selectAddDocumentRequestBody
} from "../store/reducer";
import { addDocument } from "../store/effects";
import type { AppDispatch } from "../../StoreConfiguration";

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
    } catch (error) {
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
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(documentsActions.setAddDocumentRequestBody(e.target.value));
    if (jsonError) {
      validateJson(e.target.value);
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

      <div style={{ marginBottom: "1rem" }}>
        <TextArea
          id="json-content"
          labelText="JSON Content"
          placeholder={`Enter JSON with _id field, e.g.:\n{\n  "_id": "ssauth_ssuser_SCI00818964",\n  "_collection": "ssuser"\n}`}
          value={jsonContent}
          onChange={handleJsonChange}
          invalid={!!jsonError}
          invalidText={jsonError}
          rows={20}
          disabled={isCreatePending}
        />
      </div>
    </Modal>
  );
};

export default AddDocumentComponent;

// Made with Bob