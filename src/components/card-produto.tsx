import { ArrowUpRight } from "lucide-react";
import { formatarPreco, linkProduto, nomeCategoria, nomeDaCor, tonsDaCor, type CategoriaId, type Produto } from "@/loja";
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
  "inline-flex h-10 items-center self-start rounded-full bg-pilula px-4 font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#D8E2E2]";

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

// Classes completas por ponto de quebra (o Tailwind não monta nome dinâmico)
const DEITADO = {
  md: {
    li: "col-span-2 flex-row items-stretch md:col-span-1 md:flex-col",
    foto: "w-[calc(50%-4px)] sm:w-[calc(50%-6px)] md:w-full",
    texto: "max-md:justify-center max-md:pl-4 max-md:pt-2",
  },
  lg: {
    li: "col-span-2 flex-row items-stretch lg:col-span-1 lg:flex-col",
    foto: "w-[calc(50%-4px)] sm:w-[calc(50%-6px)] lg:w-full",
    texto: "max-lg:justify-center max-lg:pl-4 max-lg:pt-2",
  },
};

/**
 * Card de produto da vitrine e da página da loja. O card inteiro leva para a
 * página do produto; o preço é o que mais aparece depois da foto.
 *
 * As fotos chegam recortadas em fundo branco; o multiply troca esse branco
 * pelo cinza do quadro, e o produto parece pousado nele, sem moldura e sem
 * corte. `deitado` serve para o card que sobra sozinho na última fileira de
 * duas colunas: foto ao lado do texto, ocupando a linha inteira até `ate`.
 */
export default function CardProduto({ p, deitado = false, ate = "lg" }: { p: Produto; deitado?: boolean; ate?: "md" | "lg" }) {
  const { t } = useIdioma();
  const preco = usePreco();
  const d = deitado ? DEITADO[ate] : null;
  const temPreco = p.precoCentavos !== null;
  const cores = p.cores.slice(0, 5);

  return (
    <li className={`group relative flex rounded-3xl bg-white p-2 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(6,34,43,0.35)] sm:p-3 ${d ? d.li : "flex-col"}`}>
      <div className={`relative aspect-square shrink-0 overflow-hidden rounded-2xl ${d ? d.foto : ""}`}>
        <FotoLoja
          id={p.fotos[0]}
          alt={p.nome}
          fundo="bg-bandeja"
          className="h-full w-full"
          imgClassName="p-[9%] mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {!p.disponivel && (
          <span className="absolute left-2 top-2 rounded-full bg-mar px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white">
            {t("Esgotado", "Sold out")}
          </span>
        )}
        {cores.length > 1 && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-1" aria-label={t(`${p.cores.length} cores`, `${p.cores.length} colours`)}>
            {cores.map((c) => <Bolinha key={c} cor={c} tamanho="h-3 w-3" />)}
          </span>
        )}
      </div>
      <div className={`flex min-w-0 flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3 ${d ? d.texto : ""}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-maré">{t(nomeCategoria(p.categoria), CATEGORIA_EN[p.categoria])}</p>
        <h3 title={p.nome} className="mt-1 line-clamp-2 min-h-[2lh] text-[15px] font-medium leading-snug tracking-[-0.03em] sm:text-lg">
          {/* O link cobre o card inteiro */}
          <a href={linkProduto(p.id)} className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-mar">
            {p.nome}
          </a>
        </h3>
        {p.opcoes.length > 0 && (
          <p className="mt-1 truncate text-[13px] text-maré">{p.opcoes.slice(0, 4).join(" · ")}{p.opcoes.length > 4 ? ` +${p.opcoes.length - 4}` : ""}</p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className={temPreco ? "whitespace-nowrap text-[1.2rem] font-semibold leading-none tracking-[-0.04em] text-mar sm:text-[1.7rem]" : "text-[15px] font-medium text-maré"}>
            {preco(p.precoCentavos)}
          </p>
          <span aria-hidden className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-sol text-mar transition-transform duration-300 group-hover:translate-x-0.5 sm:grid">
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
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
