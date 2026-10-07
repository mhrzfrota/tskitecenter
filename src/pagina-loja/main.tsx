import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProvedorIdioma, type Meta } from "@/idioma";
import "../index.css";

const META: Meta = {
  pt: {
    lang: "pt-BR",
    titulo: "Loja | TS Kite Center",
    descricao: "Kites, pranchas, foil e acessórios na TS Kite Shop, no Cumbuco (CE). Parceria North Kiteboarding.",
  },
  en: {
    lang: "en",
    titulo: "Shop | TS Kite Center",
    descricao: "Kites, boards, foil and accessories at TS Kite Shop in Cumbuco, Brazil. North Kiteboarding partner.",
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProvedorIdioma meta={META}>
      <App />
    </ProvedorIdioma>
  </React.StrictMode>,
);

