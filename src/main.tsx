import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { semearTeste, semearTeste2 } from "@/loja/teste";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

void semearTeste().then(semearTeste2);
