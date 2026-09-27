import type { Config } from "tailwindcss";

/**
 * Paleta da TS Kite Center.
 *
 * As duas cores de marca saem da própria logo, que é um degradê do amarelo
 * ao azul-piscina: o sol do Cumbuco e a água da lagoa. O fundo escuro não é
 * preto, é o azul fundo do mar no fim da tarde, para que o amarelo e o
 * turquesa pareçam luz e não neon.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Superfícies: mar fundo (escuro), espuma (claro)
        mar: { DEFAULT: "#06222B", 2: "#0B3440" },
        espuma: "#EEF7F7",
        // As duas cores da logo
        sol: "#E4C73D",
        lagoa: {
          DEFAULT: "#0FA3B8",
          /**
           * O turquesa da logo com texto branco por cima dá só 3,0 de
           * contraste. Este é o mesmo tom mais fechado (5,1 com branco,
           * 4,7 sobre a espuma): serve para botão e para texto em fundo claro.
           */
          forte: "#08798A",
        },
        // Texto secundário: `bruma` em fundo escuro (7,9), `maré` em fundo claro (5,3)
        bruma: "#9DB8BE",
        "maré": "#4E6A70",
      },
      fontFamily: {
        // Archivo largo e itálico conversa com o "TS" da logo, que é pesado e inclinado
        display: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        // Leitura de vento: número em fonte de instrumento
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        marca: "linear-gradient(100deg, #E4C73D 0%, #7EAE89 45%, #0FA3B8 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
