import type { Config } from "tailwindcss";

/**
 * Paleta da TS Kite Center, no estilo minimalista da referência Aeline.
 *
 * A referência usa quase só branco, cinzas claros e um acento vivo. Aqui o
 * acento é o amarelo da logo (`sol`) e o escuro é o azul fundo do mar, não
 * o preto. O turquesa entra pouco: ícones secundários e o céu das fotos.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mar: { DEFAULT: "#06222B", 2: "#0B3440" },
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
