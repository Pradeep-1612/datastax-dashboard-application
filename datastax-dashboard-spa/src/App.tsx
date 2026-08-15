import "@carbon/styles/css/styles.css";
import "./App.css";
import RoutesConfiguration from "./RouteConfiguration";
import SideNavContainer from "./core/containers/side-nav.container";
import HeaderContainer from "./core/containers/header.container";
import WelcomeContainer from "./core/containers/welcome.container";
import { Provider } from "react-redux";
import store from "./StoreConfiguration";
import ErrorComponent from "./core/components/error.component";
import { useState } from "react";
import { loader } from "@monaco-editor/react";
import { monacoBeforeMount } from "./utilities/monaco-theme";
import { Callout, Link } from "@carbon/react";
import { useNavigate } from "react-router-dom";

loader.init().then(monacoBeforeMount);

function App() {
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

  const handleWelcomeAccept = () => {
    setIsWelcomeAccepted(true);
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
