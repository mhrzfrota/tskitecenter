import type { Produto } from "@/loja";
import CardProduto from "./card-produto";

type Colunas = { base: 2; md?: 3; lg?: 3 | 4; xl?: 4 };

// Classes completas por ponto de quebra (o Tailwind não monta nome dinâmico)
const CLASSES = {
  md: { 3: "md:grid-cols-3" },
  lg: { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" },
  xl: { 4: "xl:grid-cols-4" },
} as const;

/**
 * Grade de produtos com todos os cards do mesmo tamanho, alinhados em
 * fileiras (vitrine, página da loja e relacionados). Substituiu, em
 * 2026-10-09, as colunas estilo Pinterest em que cada foto tinha a própria
 * proporção.
 */
export default function GradeProdutos({ produtos, colunas, className = "" }: { produtos: Produto[]; colunas: Colunas; className?: string }) {
  const cols = [
    "grid-cols-2",
    colunas.md && CLASSES.md[colunas.md],
    colunas.lg && CLASSES.lg[colunas.lg],
    colunas.xl && CLASSES.xl[colunas.xl],
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <ul className={`grid gap-x-3 gap-y-10 sm:gap-x-5 ${cols} ${className}`}>
      {produtos.map((p) => (
        <CardProduto key={p.id} p={p} />
      ))}
    </ul>
  );
}
