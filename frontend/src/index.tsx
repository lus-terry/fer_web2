import { Auth0Provider } from "@auth0/auth0-react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

if (!domain || !clientId) {
  throw new Error("Auth0 domain and clientId not defined.");
}

const rootElement = document.getElementById("root") as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    cacheLocation="localstorage"
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>
);
