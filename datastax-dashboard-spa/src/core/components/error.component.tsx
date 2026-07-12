import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@carbon/react";
import { selectErrorDetails, coreActions } from "../store/reducer";

const ErrorComponent: React.FC = () => {
  const dispatch = useDispatch();
  const errorDetails = useSelector(selectErrorDetails);

  // Handle modal close
  const handleClose = () => {
    dispatch(coreActions.setErrorDetails(undefined));
  };

  // Only render modal if errorDetails is defined
  if (!errorDetails) {
    return null;
  }

  return (
    <Modal
      open={!!errorDetails}
      onRequestClose={handleClose}
      modalLabel={errorDetails.messageType}
      modalHeading={errorDetails.messageId}
      passiveModal
      size="md"
    >
      <div>
        {errorDetails.shortText && (
          <div style={{ marginBottom: "0.5rem" }}>{errorDetails.shortText}</div>
        )}
        {errorDetails.explanation && (
          <div style={{ marginBottom: "0.5rem" }}>
            <p>{errorDetails.explanation}</p>
          </div>
        )}

        <br></br>
        {errorDetails.userAction && (
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>Suggested action:</strong>
            <p>{errorDetails.userAction}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ErrorComponent;

// Made with Bob
