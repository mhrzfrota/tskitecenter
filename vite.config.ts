import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * Duas páginas: o site (/) e o painel da loja (/admin), em pacotes separados
 * para o visitante não baixar o código do painel. Na Vercel, o /admin sem
 * ".html" vem do cleanUrls; aqui, deste plugin.
 */
function rotaAdmin() {
  type Servidor = { middlewares: { use: (f: (req: { url?: string }, res: unknown, proximo: () => void) => void) => void } };
  const usar = (s: Servidor) => {
    s.middlewares.use((req, _res, proximo) => {
      const caminho = (req.url ?? "").split("?")[0].replace(/\/$/, "");
      if (caminho === "/admin") req.url = "/admin.html" + (req.url ?? "").slice(caminho.length);
      proximo();
    });
  };
  return { name: "rota-admin", configureServer: usar, configurePreviewServer: usar };
}

export default defineConfig({
  plugins: [react(), rotaAdmin()],
  build: {
    rollupOptions: {
      input: {
        site: fileURLToPath(new URL("./index.html", import.meta.url)),
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
