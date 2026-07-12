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

function App() {
  const [isWelcomeAccepted, setIsWelcomeAccepted] = useState(() => {
    const accepted = localStorage.getItem("datastax-dashboard-welcome-accepted");
    return accepted === "true";
  });

  const handleWelcomeAccept = () => {
    setIsWelcomeAccepted(true);
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
          <main className="main-content">
            <RoutesConfiguration />
            <ErrorComponent />
          </main>
        </>
      )}
    </Provider>
  );
}

export default App;
