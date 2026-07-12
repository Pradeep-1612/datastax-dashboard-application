import { useState } from "react";
import { Checkbox, Button } from "@carbon/react";
import "./welcome.container.css";

interface WelcomeContainerProps {
  onAccept: () => void;
}

function WelcomeContainer({ onAccept }: WelcomeContainerProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem("datastax-dashboard-welcome-accepted", "true");
      onAccept();
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-background"></div>
      <div className="welcome-content">
        <h1 className="welcome-title">
          Welcome to <strong>Data on the house</strong>
        </h1>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <p className="welcome-message">
          We're excited to have you here! This application is designed to help
          you manage and visualize your data efficiently.
        </p>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="privacy-message">
          <p className="privacy-message-header">Your privacy matters:</p>
          •  Everything you do in this application stays on your device.
          <br />
          •  We do not have access to any data, settings, or configurations you create.
          <br />
          •  All of your information remains private, secure, and under your control at all times.
        </div>
        <br></br>
        <br></br>
        <div className="welcome-actions">
          <Checkbox
            id="accept-checkbox"
            labelText="I understand and accept the terms"
            checked={isChecked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIsChecked(e.target.checked)
            }
          />
          <br></br>
          <Button
            kind="primary"
            size="lg"
            disabled={!isChecked}
            onClick={handleAccept}
            className="enter-button"
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeContainer;

// Made with Bob
