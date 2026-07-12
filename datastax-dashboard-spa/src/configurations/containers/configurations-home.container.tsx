import { useForm } from "@tanstack/react-form";
import { TextInput, Button, Stack, ToastNotification } from "@carbon/react";
import { useState } from "react";
import "./configurations-home.container.css";

interface ConfigurationFormData {
  url: string;
  headerName: string;
  headerValue: string;
}

function ConfigurationsHomeContainer() {
  const [showToast, setShowToast] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      url: sessionStorage.getItem("config_url") || "",
      headerName: sessionStorage.getItem("config_headerName") || "",
      headerValue: sessionStorage.getItem("config_headerValue") || "",
    },
    onSubmit: async ({ value }) => {
      // Save to SessionStorage
      sessionStorage.setItem("config_url", value.url);
      sessionStorage.setItem("config_headerName", value.headerName);
      sessionStorage.setItem("config_headerValue", value.headerValue);

      setShowToast(true);
    },
  });

  // URL validation function
  const validateUrl = ({ value }: { value: string }): string | undefined => {
    if (!value) {
      return "URL is required";
    }

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
      if (!value || value.trim() === "") {
        return `${fieldName} is required`;
      }
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
          {/* URL Field */}
          <form.Field
            name="url"
            validators={{
              onChange: validateUrl,
            }}
          >
            {(field) => (
              <TextInput
                id="url"
                labelText="URL"
                placeholder="https://example.com"
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
              validators={{
                onChange: validateRequired("Header name"),
              }}
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
              validators={{
                onChange: validateRequired("Header value"),
              }}
            >
              {(field) => (
                <TextInput
                  id="headerValue"
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
          <br>
          </br>

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
              title="Saved."
            />
          )}
        </Stack>
      </form>
    </div>
  );
}

export default ConfigurationsHomeContainer;
