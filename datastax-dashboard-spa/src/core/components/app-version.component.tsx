import { useEffect, useState } from "react";
import type { AppVersion } from "../services/version.service";
import { versionService } from "../services/version.service";
import "./app-version.component.css";

const DOWNLOAD_URL =
  "https://ibm.ent.box.com/folder/400125706920?s=21rum4f3vaeoyo73jm54vwizhyegt6dn";

// Single promise created once at module load — all instances share it.
const versionPromise = versionService
  .getVersion()
  .then((res) => res.data)
  .catch(() => null);

function AppVersionComponent() {
  const [appVersion, setAppVersion] = useState<AppVersion | null>(null);

  useEffect(() => {
    versionPromise.then((v) => {
      if (v) setAppVersion(v);
    });
  }, []);

  return (
    <div className="app-version">
      <div className="app-version__label">Version</div>
      <div className="app-version__value">
        {appVersion ? `v${appVersion.version}` : "—"}
      </div>
      {appVersion?.releaseDate && (
        <div className="app-version__release">
          Released: {appVersion.releaseDate}
        </div>
      )}
      <a
        href={DOWNLOAD_URL}
        target="_blank"
        rel="noreferrer"
        className="app-version__download"
      >
        ↓ Download latest
      </a>
    </div>
  );
}

export default AppVersionComponent;
