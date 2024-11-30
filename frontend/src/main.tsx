import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import axios from "axios";
import { Provider as ReactContext } from "./context.tsx";

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ReactContext>
        <App />
      </ReactContext>
    </Provider>
  </StrictMode>
);
