import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  Link,
  DataTableSkeleton,
} from "@carbon/react";
import { Edit, Copy, TrashCan } from "@carbon/icons-react";
import {
  selectDocuments,
  selectFetching,
  selectFetchTime,
  selectSearchQuery,
  documentsActions,
} from "../store/reducer";
import type { AppDispatch } from "../../StoreConfiguration";
import NoItemsFound from "../../core/components/no-items-found.component";
import UpdateDocumentComponent from "../components/update-document.component";
import DeleteDocumentComponent from "../components/delete-document.component";
import "./document-table.container.css"

const DocumentTableContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get documents from Redux store using selectors
  const documents = useSelector(selectDocuments);
  const fetching = useSelector(selectFetching);
  const fetchTime = useSelector(selectFetchTime);
  const searchQuery = useSelector(selectSearchQuery);

  // Track which document was copied
  const [copiedDocumentId, setCopiedDocumentId] = useState(null);

  // Handler functions for actions
  const handleEdit = (documentId: string, document: any) => {
    console.log("Edit document:", documentId);
    dispatch(documentsActions.updateDocumentRequested(document));
  };

  const handleCopy = async (documentId: string, document: any) => {
    try {
      // Convert document to formatted JSON string
      const documentJson = JSON.stringify(document, null, 2);

      // Copy to clipboard
      await navigator.clipboard.writeText(documentJson);

      // Set copied state
      setCopiedDocumentId(documentId);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedDocumentId(null);
      }, 2000);

      console.log("Document copied to clipboard:", documentId);
    } catch (error) {
      console.error("Failed to copy document:", error);
    }
  };

  const handleDelete = (documentId: string, document: any) => {
    console.log("Delete document:", documentId);
    dispatch(documentsActions.deleteDocumentRequested(document));
  };

  // Show message if no documents after fetching
  if (!searchQuery || Object.keys(searchQuery).length === 0) {
    return;
  }

  // Show skeleton while fetching
  if (fetching) {
    return (
      <DataTableSkeleton
        aria-label="sample table"
        headers={[
          {
            header: "Document ID",
            key: "Document ID",
          },
          {
            header: "Actions",
            key: "Actions",
          },
        ]}
        rowCount={10}
        showHeader={false}
        showToolbar={false}
      />
    );
  }

  // Show message if no documents after fetching
  // Only show NoItemsFound if we have documents array (even if empty) and it's actually empty
  if (
    searchQuery &&
    Object.keys(searchQuery).length !== 0 &&
    !fetching &&
    documents &&
    documents.length === 0
  ) {
    return <NoItemsFound />;
  }

  // Don't render anything if documents haven't been loaded yet
  if (!documents) {
    return null;
  }

  return (
    <>
      <div className="result-summary">
        <p>
          {documents.length} {documents.length === 1 ? 'result' : 'results'} found
          {fetchTime !== null && (
            <span> in {(fetchTime / 1000).toFixed(2)} s</span>
          )}
          .
        </p>
      </div>
      <TableContainer
        style={{ height: "calc(100vh - 290px)", overflow: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Document ID</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document._id}>
                <TableCell>
                  <Link onClick={() => handleEdit(document._id, document)}>
                    {document._id}
                  </Link>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={Edit}
                      iconDescription="Edit"
                      hasIconOnly
                      onClick={() => handleEdit(document._id, document)}
                    />
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={Copy}
                      iconDescription={
                        copiedDocumentId === document._id ? "Copied!" : "Copy"
                      }
                      hasIconOnly
                      onClick={() => handleCopy(document._id, document)}
                    ></Button>
                    <Button
                      kind="danger--ghost"
                      size="sm"
                      renderIcon={TrashCan}
                      iconDescription="Delete"
                      hasIconOnly
                      onClick={() => handleDelete(document._id, document)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Document Modal */}
      <UpdateDocumentComponent />

      {/* Delete Document Modal */}
      <DeleteDocumentComponent />
    </>
  );
};

export default DocumentTableContainer;

// Made with Bob
