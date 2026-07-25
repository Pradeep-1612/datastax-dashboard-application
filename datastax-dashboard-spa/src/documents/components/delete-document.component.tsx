import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { Modal } from "@carbon/react";
import { defaultEditorOptions, MONACO_THEME } from "../../utilities/monaco-theme";
import {
  documentsActions,
  selectDeletePending,
  selectIsDeleteDocumentRequested,
  selectSelectedDocument
} from "../store/reducer";
import { deleteDocument } from "../store/effects";
import type { AppDispatch } from "../../StoreConfiguration";

const DeleteDocumentComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isDeletePending = useSelector(selectDeletePending);
  const isDeleteDocumentRequested = useSelector(selectIsDeleteDocumentRequested);
  const selectedDocument = useSelector(selectSelectedDocument);

  // Get document content without _id field for display
  const getDocumentContent = () => {
    if (!selectedDocument) return "";
    const { _id, ...dataWithoutId } = selectedDocument; // eslint-disable-line @typescript-eslint/no-unused-vars
    return JSON.stringify(dataWithoutId, null, 2);
  };

  // Handle Delete button click
  const handleDelete = async () => {
    try {
      // Call the delete document effect with the document ID
      dispatch(deleteDocument(selectedDocument._id));

      // Note: Modal will close automatically when deleteDocumentSuccess is dispatched
      // from the deleteDocument effect after successful completion
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Handle modal close
  const handleClose = () => {
    dispatch(documentsActions.deleteDocumentSuccess());
  };

  return (
    <Modal
      open={isDeleteDocumentRequested}
      onRequestClose={handleClose}
      modalHeading={`_id: ${selectedDocument?._id}`}
      modalLabel="Delete document"
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleDelete}
      onSecondarySubmit={handleClose}
      primaryButtonDisabled={isDeletePending}
      danger
      size="md"
    >
      <p style={{ marginBottom: "1rem" }}>
        Are you sure you want to delete this document? This action cannot be
        undone.
      </p>
      <div style={{ marginBottom: "1rem" }}>
        <Editor
          height="400px"
          defaultLanguage="json"
          theme={MONACO_THEME}
          value={getDocumentContent()}
          options={{
            ...defaultEditorOptions,
            readOnly: true,
          }}
        />
      </div>
    </Modal>
  );
};

export default DeleteDocumentComponent;