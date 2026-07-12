import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, TextArea } from "@carbon/react";
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
    const { _id, ...dataWithoutId } = selectedDocument;
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
      size="sm"
    >
      <p style={{ marginBottom: "1rem" }}>
        Are you sure you want to delete this document? This action cannot be
        undone.
      </p>
      <div style={{ marginBottom: "1rem" }}>
        <TextArea
          id="document-content"
          labelText="Document Content"
          value={getDocumentContent()}
          rows={20}
          readOnly={true}
        />
      </div>
    </Modal>
  );
};

export default DeleteDocumentComponent;

// Made with Bob