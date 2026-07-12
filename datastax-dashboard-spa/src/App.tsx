import "@carbon/styles/css/styles.css";
import "./App.css";
import RoutesConfiguration from "./RouteConfiguration";
import SideNavContainer from "./core/containers/side-nav.container";
import HeaderContainer from "./core/containers/header.container";
import { Provider } from "react-redux";
import store from "./StoreConfiguration";
import ErrorComponent from "./core/components/error.component";

function App() {
  return (
    <Provider store={store}>
      <HeaderContainer />
      <SideNavContainer />
      <main className="main-content">
        <RoutesConfiguration />
        <ErrorComponent />
      </main>
    </Provider>
  );
}

export default App;
