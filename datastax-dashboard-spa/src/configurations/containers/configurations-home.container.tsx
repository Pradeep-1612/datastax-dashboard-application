import { useForm } from "@tanstack/react-form";
import {
  TextInput,
  Button,
  Stack,
  ToastNotification,
  Select,
  SelectItem,
  CodeSnippet,
} from "@carbon/react";
import { useState, useEffect } from "react";
import { encryptState } from "../../utilities/shared-link-crypto";
import "./configurations-home.container.css";

// The SPA path prefix used in shareable links
const SHARE_PATH_PREFIX = "/DataOnTheHouse/documents";

/**
 * Snapshot of the configuration as it was last saved.
 * The link-generation effect depends on this — so changing the
 * environment dropdown alone never triggers re-encryption.
 */
interface SavedConfig {
  urlKeyspace: string;
  collection: string;
  headerName: string;
  headerValue: string;
  environment: string;
}

function readSavedConfig(): SavedConfig {
  return {
    urlKeyspace: sessionStorage.getItem("config_url_keyspace") || "",
    collection: sessionStorage.getItem("config_collection") || "",
    headerName: sessionStorage.getItem("config_headerName") || "",
    headerValue: sessionStorage.getItem("config_headerValue") || "",
    environment: sessionStorage.getItem("config_environment") || "",
  };
}

function ConfigurationsHomeContainer() {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [envError, setEnvError] = useState<string>("");

  // Local dropdown state — only written to sessionStorage on Save
  const [selectedEnv, setSelectedEnv] = useState<string>(
    () => sessionStorage.getItem("config_environment") || "",
  );

  // savedConfig changes only when the user clicks Save — the effect below
  // depends on it, so nothing re-encrypts on mere dropdown changes
  const [savedConfig, setSavedConfig] = useState<SavedConfig>(readSavedConfig);

  const [shareLink, setShareLink] = useState<string>("");

  const form = useForm({
    defaultValues: {
      urlKeyspace: savedConfig.urlKeyspace,
      collection: savedConfig.collection,
      headerName: savedConfig.headerName,
      headerValue: savedConfig.headerValue,
    },
    onSubmit: async ({ value }) => {
      // Validate environment manually (it lives outside the form)
      if (!selectedEnv) {
        setEnvError("Environment is required");
        return;
      }
      setEnvError("");

      // Persist all fields including environment
      sessionStorage.setItem("config_url_keyspace", value.urlKeyspace);
      sessionStorage.setItem("config_collection", value.collection);
      sessionStorage.setItem("config_headerName", value.headerName);
      sessionStorage.setItem("config_headerValue", value.headerValue);
      sessionStorage.setItem("config_environment", selectedEnv);

      // Updating savedConfig triggers the link-generation effect
      setSavedConfig({
        urlKeyspace: value.urlKeyspace,
        collection: value.collection,
        headerName: value.headerName,
        headerValue: value.headerValue,
        environment: selectedEnv,
      });

      setShowToast(true);
    },
  });

  /**
   * Generates the shareable link and syncs the browser URL.
   * Runs only when savedConfig changes — i.e. only after the user clicks Save.
   */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { urlKeyspace, collection, headerName, headerValue, environment } =
        savedConfig;

      if (!environment || !headerValue) {
        setShareLink("");
        if (window.location.search) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        return;
      }

      const encryptedState = await encryptState(
        { urlKeyspace, collection, headerName },
        headerValue,
      );
      if (cancelled) return;

      const params = `?environment=${environment}&state=${encryptedState}`;
      setShareLink(
        `${window.location.origin}${SHARE_PATH_PREFIX}${params}`,
      );

      // Keep the browser URL in sync without adding a history entry
      if (window.location.search !== params) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${params}`,
        );
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [savedConfig]);

  // URL validation
  const validateUrl = ({ value }: { value: string }): string | undefined => {
    if (!value) return "URL is required";
    try {
      new URL(value);
      return undefined;
    } catch {
      return "Please enter a valid URL (e.g., https://example.com)";
    }
  };

  // Required field validation
  const validateRequired =
    (fieldName: string) =>
    ({ value }: { value: string }): string | undefined => {
      if (!value || value.trim() === "") return `${fieldName} is required`;
      return undefined;
    };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1>Configurations</h1>

      <br></br>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Stack gap={6}>
          {/* Environment — mandatory; only applied to sessionStorage on Save */}
          <Select
            id="share-environment"
            labelText="Environment"
            value={selectedEnv}
            invalid={!!envError}
            invalidText={envError}
            onChange={(e) => {
              setSelectedEnv(e.target.value);
              if (e.target.value) setEnvError("");
            }}
          >
            <SelectItem value="" text="Select an environment" />
            <SelectItem value="local" text="Local" />
            <SelectItem value="dev" text="Dev" />
            <SelectItem value="qa" text="QA" />
            <SelectItem value="cte" text="CTE" />
            <SelectItem value="production" text="Production" />
          </Select>

          {/* URL Keyspace Field */}
          <form.Field name="urlKeyspace" validators={{ onChange: validateUrl }}>
            {(field) => (
              <TextInput
                id="urlKeyspace"
                labelText="URL (up to keyspace)"
                placeholder="http://example.com:8181/v1/keyspace"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                invalid={field.state.meta.errors.length > 0}
                invalidText={field.state.meta.errors[0] as string}
              />
            )}
          </form.Field>

          {/* Collection Field */}
          <form.Field
            name="collection"
            validators={{ onChange: validateRequired("Collection") }}
          >
            {(field) => (
              <TextInput
                id="collection"
                labelText="Collection name"
                placeholder="collection"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                invalid={field.state.meta.errors.length > 0}
                invalidText={field.state.meta.errors[0] as string}
              />
            )}
          </form.Field>

          <div className="flex-container-24">
            {/* Header Name Field */}
            <form.Field
              name="headerName"
              validators={{ onChange: validateRequired("Header name") }}
            >
              {(field) => (
                <TextInput
                  id="headerName"
                  labelText="Header name"
                  placeholder="e.g., Authorization"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  invalid={field.state.meta.errors.length > 0}
                  invalidText={field.state.meta.errors[0] as string}
                />
              )}
            </form.Field>

            {/* Header Value Field */}
            <form.Field
              name="headerValue"
              validators={{ onChange: validateRequired("Header value") }}
            >
              {(field) => (
                <TextInput
                  id="headerValue"
                  type="password"
                  labelText="Header value"
                  placeholder="e.g., Bearer token123"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  invalid={field.state.meta.errors.length > 0}
                  invalidText={field.state.meta.errors[0] as string}
                />
              )}
            </form.Field>
          </div>
          <br></br>

          {/* Save Button */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            )}
          </form.Subscribe>

          {/* Success Toast Notification */}
          {showToast && (
            <ToastNotification
              aria-label="closes notification"
              caption=""
              kind="success"
              lowContrast
              onClose={() => setShowToast(false)}
              onCloseButtonClick={() => setShowToast(false)}
              role="status"
              statusIconDescription="notification"
              subtitle="Your configuration has been saved successfully."
              timeout={3000}
              title="You are all set."
            />
          )}

          {/* Shareable link — only after Save when env + headerValue are set */}
          {savedConfig.environment && savedConfig.headerValue && shareLink && (
            <div className="share-link-callout">
              <p className="share-link-callout-title">Direct access link</p>
              <p className="share-link-hint">
                Use the link below to access the{" "}
                <strong>{savedConfig.environment}</strong> environment directly.
                You'll be prompted to enter the header value or password to sign in.
                Copy and save this link for quick access later.
              </p>
              <CodeSnippet
                feedback="Copied!"
                aria-label="Shareable configuration link"
              >
                {shareLink}
              </CodeSnippet>
            </div>
          )}
        </Stack>
      </form>
    </div>
  );
}

export default ConfigurationsHomeContainer;
