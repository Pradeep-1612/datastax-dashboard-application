import { useState, useEffect } from "react";
import { buildKeyParam } from "./shared-link-crypto";

/**
 * Reads the current configuration from sessionStorage and, when both
 * `config_environment` and `config_headerValue` are set, produces the
 * `?environment=<env>&keyspace=<url>&collection=<col>&username=<name>&key=<blob>`
 * query string.
 *
 * The `key` param is an AES-GCM blob derived from the keyspace hostname +
 * last path segment, encrypted with the password. It lets the unlock screen
 * verify the password client-side without a network call.
 *
 * Returns an empty string when the configuration is incomplete — callers
 * should treat that as "no params to append".
 *
 * Re-runs whenever the `refreshKey` argument changes, allowing callers to
 * trigger a fresh generation (e.g. after Save).
 */
export function useSharedLinkParams(refreshKey?: unknown): string {
  const [params, setParams] = useState("");

  useEffect(() => {
    const environment = sessionStorage.getItem("config_environment") || "";
    const headerValue = sessionStorage.getItem("config_headerValue") || "";
    const urlKeyspace = sessionStorage.getItem("config_url_keyspace") || "";
    const collection = sessionStorage.getItem("config_collection") || "";
    const headerName = sessionStorage.getItem("config_headerName") || "";

    if (!environment || !headerValue) {
      setParams("");
      return;
    }

    let cancelled = false;

    buildKeyParam(urlKeyspace, headerValue).then((keyParam) => {
      if (!cancelled) {
        setParams(
          `?environment=${encodeURIComponent(environment)}` +
            `&keyspace=${encodeURIComponent(urlKeyspace)}` +
            `&collection=${encodeURIComponent(collection)}` +
            `&username=${encodeURIComponent(headerName)}` +
            `&key=${keyParam}`,
        );
      }
    });

    return () => {
      cancelled = true;
    };
    // refreshKey intentionally included — callers bump it to force re-generation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return params;
}
