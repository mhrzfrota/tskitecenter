import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * Três páginas: o site (/), a loja com todos os produtos (/loja) e o painel
 * (/admin), em pacotes separados para o visitante não baixar o código do
 * painel. Na Vercel, o caminho sem ".html" vem do cleanUrls; aqui, deste plugin.
 */
function rotasLimpas() {
  type Servidor = { middlewares: { use: (f: (req: { url?: string }, res: unknown, proximo: () => void) => void) => void } };
  const usar = (s: Servidor) => {
    s.middlewares.use((req, _res, proximo) => {
      const caminho = (req.url ?? "").split("?")[0].replace(/\/$/, "");
      if (caminho === "/admin" || caminho === "/loja") req.url = `${caminho}.html` + (req.url ?? "").slice(caminho.length);
      proximo();
    });
  };
  return { name: "rotas-limpas", configureServer: usar, configurePreviewServer: usar };
}

export default defineConfig({
  plugins: [react(), rotasLimpas()],
  build: {
    rollupOptions: {
      input: {
        site: fileURLToPath(new URL("./index.html", import.meta.url)),
        loja: fileURLToPath(new URL("./loja.html", import.meta.url)),
        admin: fileURLToPath(new URL("./admin.html", import.meta.url)),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
