import { useState } from "react";
import { Button, InlineNotification, TextInput, Tooltip } from "@carbon/react";
import { Information } from "@carbon/icons-react";
import { decryptState } from "../../utilities/shared-link-crypto";
import "./shared-link-unlock.container.css";

interface SharedLinkUnlockContainerProps {
  /** The raw base64url `state` param from the URL */
  encodedState: string;
  /** The environment label from the URL (kept in URL; shown to the user) */
  environment: string;
  /** Called after credentials are verified and configuration is written to sessionStorage */
  onUnlocked: () => void;
}

function SharedLinkUnlockContainer({
  encodedState,
  environment,
  onUnlocked,
}: SharedLinkUnlockContainerProps) {
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!password.trim()) return;

    setIsSigningIn(true);
    setError(null);

    try {
      const payload = await decryptState(encodedState, password.trim());

      if (payload.urlKeyspace)
        sessionStorage.setItem("config_url_keyspace", payload.urlKeyspace);
      if (payload.collection)
        sessionStorage.setItem("config_collection", payload.collection);
      if (payload.headerName)
        sessionStorage.setItem("config_headerName", payload.headerName);
      sessionStorage.setItem("config_headerValue", password.trim());
      if (environment)
        sessionStorage.setItem("config_environment", environment);

      onUnlocked();
    } catch {
      setError("Incorrect header value or password. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="unlock-container">
      <div className="unlock-background"></div>
      <div className="unlock-content">
        <h1 className="unlock-title">
          Welcome back!
        </h1>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <p className="unlock-subtitle">
          You're now accessing the <strong>{environment}</strong> environment.
        </p>
        <br></br>
        <br></br>
        <br></br>

        <div className="unlock-form">
          <TextInput
            id="unlock-password"
            type="password"
            labelText={
              <span className="unlock-label">
                Header value / password
                <Tooltip
                  label="Enter the header value or password you provided when configuring this direct access link."
                  align="right"
                >
                  <span className="unlock-tooltip-icon">
                    <Information size={16} />
                  </span>
                </Tooltip>
              </span>
            }
            placeholder="Enter the Header value or password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSignIn();
            }}
            invalid={!!error}
            invalidText={error ?? undefined}
          />

          {error && (
            <InlineNotification
              kind="error"
              title="Sign-in failed"
              subtitle={error}
              lowContrast
              hideCloseButton
            />
          )}

          <br></br>

          <Button
            kind="primary"
            size="lg"
            disabled={!password.trim() || isSigningIn}
            onClick={handleSignIn}
            className="unlock-button"
          >
            {isSigningIn ? "Signing in…" : "Sign in"}
          </Button>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="privacy-message">
          <p className="privacy-message-header">Your privacy matters</p>
          Your data, settings, and configurations stay on your device and remain under your control.
        </div>
      </div>
    </div>
  );
}

export default SharedLinkUnlockContainer;
