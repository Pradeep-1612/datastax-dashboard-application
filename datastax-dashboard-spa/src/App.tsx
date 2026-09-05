import "@carbon/styles/css/styles.css";
import "./App.css";
import RoutesConfiguration from "./RouteConfiguration";
import SideNavContainer from "./core/containers/side-nav.container";
import HeaderContainer from "./core/containers/header.container";
import WelcomeContainer from "./core/containers/welcome.container";
import SharedLinkUnlockContainer from "./core/containers/shared-link-unlock.container";
import { Provider } from "react-redux";
import store from "./StoreConfiguration";
import ErrorComponent from "./core/components/error.component";
import { useState } from "react";
import { loader } from "@monaco-editor/react";
import { monacoBeforeMount } from "./utilities/monaco-theme";
import { Callout, Link } from "@carbon/react";
import { useNavigate, useSearchParams } from "react-router-dom";

loader.init().then(monacoBeforeMount);

function App() {
  const [searchParams] = useSearchParams();
  const encodedState = searchParams.get("state");
  const environment = searchParams.get("environment") ?? "";

  // True when the user arrived via a shared link that hasn't been unlocked yet.
  // If config_headerValue is already in sessionStorage the user already unlocked
  // this session (e.g. they refreshed the page) — skip the unlock screen.
  const [needsUnlock, setNeedsUnlock] = useState<boolean>(
    () => !!encodedState && !sessionStorage.getItem("config_headerValue"),
  );

  const [isWelcomeAccepted, setIsWelcomeAccepted] = useState(() => {
    const accepted = localStorage.getItem(
      "datastax-dashboard-welcome-accepted",
    );
    return accepted === "true";
  });

  const navigate = useNavigate();

  const isConfigured =
    !!sessionStorage.getItem("config_url_keyspace") &&
    !!sessionStorage.getItem("config_collection");

  // After welcome is accepted, proceed to unlock if a shared link is pending.
  const handleWelcomeAccept = () => {
    setIsWelcomeAccepted(true);
    // needsUnlock was already initialised correctly — no change needed here
  };

  // Called by the unlock screen once decryption succeeds.
  const handleUnlocked = () => {
    setNeedsUnlock(false);
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <Provider store={store}>
      {!isWelcomeAccepted ? (
        <>
          <HeaderContainer />
          <WelcomeContainer onAccept={handleWelcomeAccept} />
        </>
      ) : needsUnlock && encodedState ? (
        <>
          <HeaderContainer />
          <SharedLinkUnlockContainer
            encodedState={encodedState}
            environment={environment}
            onUnlocked={handleUnlocked}
          />
        </>
      ) : (
        <>
          <HeaderContainer />
          <SideNavContainer />
          <main className="main-content cds--content">
            {!isConfigured && (
              <>
                <Callout
                  title="Action required"
                  titleId="my fancy id 123"
                  kind="warning"
                  lowContrast
                >
                  <div className="cds--inline-notification__subtitle">
                    No database endpoint has been configured.{" "}
                    <Link onClick={handleNavigation("/configurations")}>
                      Configure now.
                    </Link>
                  </div>
                </Callout>
                <br></br>
              </>
            )}
            <RoutesConfiguration />
            <ErrorComponent />
          </main>
        </>
      )}
    </Provider>
  );
}

export default App;
