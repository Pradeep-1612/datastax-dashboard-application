import { useState, useEffect } from "react";
import { encryptState } from "./shared-link-crypto";

/**
 * Reads the current configuration from sessionStorage and, when both
 * `config_environment` and `config_headerValue` are set, asynchronously
 * produces the `?environment=<env>&state=<encrypted>` query string.
 *
 * Returns an empty string when the configuration is incomplete (no environment
 * or no headerValue) — callers should treat that as "no params to append".
 *
 * Re-runs whenever the `refreshKey` argument changes, allowing callers to
 * trigger a fresh generation (e.g. after Save).
 */
export function useSharedLinkParams(refreshKey?: unknown): string {
  const [params, setParams] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const environment = sessionStorage.getItem("config_environment") || "";
      const headerValue = sessionStorage.getItem("config_headerValue") || "";
      const urlKeyspace = sessionStorage.getItem("config_url_keyspace") || "";
      const collection = sessionStorage.getItem("config_collection") || "";
      const headerName = sessionStorage.getItem("config_headerName") || "";

      if (!environment || !headerValue) {
        setParams("");
        return;
      }

      try {
        const encryptedState = await encryptState(
          { urlKeyspace, collection, headerName },
          headerValue,
        );
        if (!cancelled) {
          setParams(`?environment=${environment}&state=${encryptedState}`);
        }
      } catch {
        if (!cancelled) setParams("");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // refreshKey intentionally included — callers bump it to force re-generation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return params;
}
