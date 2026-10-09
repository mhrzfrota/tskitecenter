import type { Config } from "tailwindcss";

/**
 * Paleta da TS Kite Center.
 *
 * Desde 2026-10-08, com a North (northactionsports.com) como referência de
 * elegância: as seções alternam azul (`oceano`, no lugar do preto da North)
 * e claro, e o amarelo da logo (`sol`) segue como único acento. O turquesa entra pouco: o céu das fotos que faltam.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mar: { DEFAULT: "#06222B", 2: "#0B3440" },
        // Fundo das seções escuras: o azul do céu que ficava no hero antes do
        // vídeo (o topo do gradiente `ceu`). Branco sobre ele: 6,2:1
        oceano: "#0A6A7C",
        // Fundo das seções claras que precisam se separar do branco
        nevoa: "#F3F6F6",
        sol: "#E4C73D",
        lagoa: {
          DEFAULT: "#0FA3B8",
          // Turquesa com texto branco dá 3,0; este dá 5,1
          forte: "#08798A",
        },
        // Cinzas levemente frios, para conversar com o mar
        bandeja: "#EFF3F3", // fundo que agrupa os cards
        pilula: "#E4EBEB", // botão secundário
        "maré": "#56676B", // texto secundário (5,6 sobre branco)
        bruma: "#9DB8BE",
        espuma: "#EEF7F7",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        painel: "28px",
        // Cantos da referência North: discretos, quase retos
        cartao: "10px",
      },
      backgroundImage: {
        marca: "linear-gradient(100deg, #E4C73D 0%, #7EAE89 45%, #0FA3B8 100%)",
        ceu: "linear-gradient(180deg, #0A6A7C 0%, #1592A6 45%, #7FCFDA 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
