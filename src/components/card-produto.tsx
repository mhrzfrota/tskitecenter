import { linkWhatsApp } from "@/marca";
import { formatarPreco, nomeCategoria, type CategoriaId, type Produto } from "@/loja";
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
 * Card de produto da vitrine e da página da loja.
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

  return (
    <li className={`group flex rounded-3xl bg-white p-2 sm:p-3 ${d ? d.li : "flex-col"}`}>
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
      </div>
      <div className={`flex min-w-0 flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3 ${d ? d.texto : ""}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-maré">{t(nomeCategoria(p.categoria), CATEGORIA_EN[p.categoria])}</p>
        <h3 title={p.nome} className="mt-1 line-clamp-2 min-h-[2lh] text-base font-medium leading-snug tracking-[-0.03em] sm:text-xl">
          {p.nome}
        </h3>
        <p className="mt-0.5 text-sm text-maré">{preco(p.precoCentavos)}</p>
        {p.opcoes.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1">
            {p.opcoes.slice(0, 4).map((o) => (
              <li key={o} className="rounded-full bg-bandeja px-2 py-0.5 text-[12px]">
                {o}
              </li>
            ))}
            {p.opcoes.length > 4 && <li className="px-1 text-[12px] text-maré">+{p.opcoes.length - 4}</li>}
          </ul>
        )}
        <div className="mt-auto pt-4">
          <a
            href={linkWhatsApp(
              p.disponivel
                ? t(`Olá! Tenho interesse no produto: ${p.nome}.`, `Hi! I'm interested in this product: ${p.nome}.`)
                : t(`Olá! O ${p.nome} vai voltar ao estoque?`, `Hi! Will the ${p.nome} be back in stock?`),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={botaoConsultar}
          >
            {p.disponivel ? t("Consultar", "Ask us") : t("Avise-me", "Notify me")}
          </a>
        </div>
      </div>
    </li>
  );
}
