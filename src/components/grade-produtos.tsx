import { useEffect, useState } from "react";
import { proporcaoDaFoto, type Produto } from "@/loja";
import CardProduto from "./card-produto";

type Colunas = { base: number; sm?: number; md?: number; lg?: number; xl?: number };

// Pontos de quebra do Tailwind, do maior para o menor
const QUEBRAS = [["xl", 1280], ["lg", 1024], ["md", 768], ["sm", 640]] as const;

function contar(c: Colunas) {
  if (typeof window === "undefined") return c.base;
  for (const [nome, px] of QUEBRAS) if (c[nome] && window.matchMedia(`(min-width: ${px}px)`).matches) return c[nome]!;
  return c.base;
}

function useColunas(c: Colunas) {
  const [n, setN] = useState(() => contar(c));
  useEffect(() => {
    const atualizar = () => setN(contar(c));
    const listas = QUEBRAS.map(([, px]) => window.matchMedia(`(min-width: ${px}px)`));
    listas.forEach((m) => m.addEventListener("change", atualizar));
    atualizar();
    return () => listas.forEach((m) => m.removeEventListener("change", atualizar));
  }, [c.base, c.sm, c.md, c.lg, c.xl]); // eslint-disable-line react-hooks/exhaustive-deps
  return n;
}

/**
 * Cada card vai para a coluna mais baixa até ali. Altura estimada em
 * larguras de coluna: a foto (1 / proporção; quadrado quando é recortada)
 * mais o texto do card.
 */
export function distribuir(produtos: Produto[], n: number): Produto[][] {
  const colunas: Produto[][] = Array.from({ length: n }, () => []);
  const alturas = Array<number>(n).fill(0);
  for (const p of produtos) {
    const i = alturas.indexOf(Math.min(...alturas));
    colunas[i].push(p);
    alturas[i] += 1 / (proporcaoDaFoto(p.fotos[0]) ?? 1) + 0.6;
  }
  return colunas;
}

/**
 * Grade de produtos em colunas (estilo Pinterest). Cada foto mantém a
 * própria proporção, então os cards têm alturas diferentes; em colunas
 * eles se encaixam sem buraco entre um e outro.
 */
export default function GradeProdutos({ produtos, colunas, className = "" }: { produtos: Produto[]; colunas: Colunas; className?: string }) {
  const n = useColunas(colunas);
  return (
    <div className={`flex items-start gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 ${className}`}>
      {distribuir(produtos, n).map((lista, i) => (
        <ul key={i} className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
          {lista.map((p) => <CardProduto key={p.id} p={p} />)}
        </ul>
      ))}
    </div>
  );
}
