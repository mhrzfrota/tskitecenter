import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProvedorIdioma } from "./idioma";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProvedorIdioma>
      <App />
    </ProvedorIdioma>
  </React.StrictMode>,
);

