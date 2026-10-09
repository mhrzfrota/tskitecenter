import { ArrowRight } from "lucide-react";
import { formatarPreco, linkProduto, nomeCategoria, nomeDaCor, proporcaoDaFoto, tonsDaCor, type CategoriaId, type Produto } from "@/loja";
import { useIdioma } from "@/idioma";
import FotoLoja from "@/admin/FotoLoja";

// Nome das categorias do painel na versão em inglês do site
export const CATEGORIA_EN: Record<CategoriaId, string> = {
  kites: "Kite",
  pranchas: "Board",
  foil: "Foil",
  trapezios: "Harness",
  bones: "Cap",
  vestuario: "Apparel",
  acessorios: "Accessory",
};

export const CATEGORIA_EN_PLURAL: Record<CategoriaId, string> = {
  kites: "Kites",
  pranchas: "Boards",
  foil: "Foil",
  trapezios: "Harnesses",
  bones: "Caps",
  vestuario: "Apparel",
  acessorios: "Accessories",
};

export const botaoConsultar =
  "inline-flex h-10 items-center self-start rounded-full px-4 text-[14px] font-semibold ring-1 ring-inset ring-mar/20 transition-colors hover:bg-mar/5";

/** Preço sempre em reais; em inglês muda só a pontuação e o "sob consulta". */
export function usePreco() {
  const { idioma } = useIdioma();
  return (centavos: number | null) =>
    idioma === "en"
      ? centavos === null
        ? "Price on request"
        : (centavos / 100).toLocaleString("en-US", { style: "currency", currency: "BRL" })
      : formatarPreco(centavos);
}

/**
 * Card de produto da vitrine, da página da loja e dos relacionados, sem caixa
 * em volta, como os da North. Todo card tem o mesmo tamanho: foto quadrada e,
 * embaixo, categoria, nome (duas linhas reservadas) e preço, alinhados em
 * todos os cards da fileira. O card inteiro leva para a página do produto.
 *
 * Foto com cenário (grama, folhagem) preenche o quadrado, sem faixa em volta:
 * o recorte só tira fundo, conferido foto a foto em 2026-10-09 (nenhum
 * produto encosta na borda do quadrado central). Foto recortada em fundo
 * branco entra inteira, e o multiply troca o branco pelo cinza do quadro.
 */
export default function CardProduto({ p }: { p: Produto }) {
  const { t } = useIdioma();
  const preco = usePreco();
  const temPreco = p.precoCentavos !== null;
  const cores = p.cores.slice(0, 5);
  const comCenario = proporcaoDaFoto(p.fotos[0]) !== null;

  return (
    <li className="group relative flex flex-col">
      <div className="relative aspect-square shrink-0 overflow-hidden rounded-cartao">
        <FotoLoja
          id={p.fotos[0]}
          alt={p.nome}
          fundo="bg-nevoa"
          className="h-full w-full"
          imgClassName={
            comCenario
              ? "!object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              : "p-[9%] mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.05]"
          }
        />
        {!p.disponivel && (
          <span className="absolute left-2 top-2 rounded-full bg-mar px-2.5 py-1 text-[11px] font-semibold text-white">
            {t("Esgotado", "Sold out")}
          </span>
        )}
        {cores.length > 1 && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-1" aria-label={t(`${p.cores.length} cores`, `${p.cores.length} colours`)}>
            {cores.map((c) => <Bolinha key={c} cor={c} tamanho="h-3 w-3" />)}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-maré">{t(nomeCategoria(p.categoria), CATEGORIA_EN[p.categoria])}</p>
        <h3 title={p.nome} className="mt-1.5 line-clamp-2 min-h-[2lh] text-[15px] font-semibold leading-snug tracking-[-0.02em] sm:text-lg">
          {/* O link cobre o card inteiro */}
          <a href={linkProduto(p.id)} className="outline-none after:absolute after:inset-0 after:rounded-cartao focus-visible:after:ring-2 focus-visible:after:ring-mar">
            {p.nome}
          </a>
        </h3>
        {p.opcoes.length > 0 ? (
          <p className="mt-1 truncate text-[13px] text-maré">{p.opcoes.slice(0, 4).join(" · ")}{p.opcoes.length > 4 ? ` +${p.opcoes.length - 4}` : ""}</p>
        ) : (
          <p aria-hidden className="mt-1 text-[13px]">&nbsp;</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className={temPreco ? "whitespace-nowrap text-[1.2rem] font-semibold leading-none tracking-[-0.04em] text-mar sm:text-[1.5rem]" : "text-[15px] font-medium text-maré"}>
            {preco(p.precoCentavos)}
          </p>
          <ArrowRight aria-hidden className="hidden h-5 w-5 shrink-0 text-mar/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-mar sm:block" />
        </div>
      </div>
    </li>
  );
}

/** Bolinha de cor; cor composta ("Preto/Amarelo") sai dividida na diagonal. */
export function Bolinha({ cor, tamanho = "h-4 w-4" }: { cor: string; tamanho?: string }) {
  const tons = tonsDaCor(cor);
  const fundo =
    tons.length > 1 ? `linear-gradient(135deg, ${tons[0]} 50%, ${tons[1]} 50%)` : tons[0] ?? "repeating-linear-gradient(45deg,#cfd8da 0 3px,#fff 3px 6px)";
  return <span title={nomeDaCor(cor)} className={`inline-block shrink-0 rounded-full ring-1 ring-black/15 ${tamanho}`} style={{ background: fundo }} />;
}
