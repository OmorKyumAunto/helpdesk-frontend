import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store/store";
// import AuthMiddleware from "./utils/AuthMiddleware";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.Suspense>
    <Provider store={store}>
      <App />
    </Provider>
  </React.Suspense>
);
