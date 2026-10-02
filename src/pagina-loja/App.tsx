import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import { CATEGORIAS, loja, type CategoriaId, type Produto } from "@/loja";
import { useIdioma } from "@/idioma";
import Navbar from "@/components/navbar";
import Rodape from "@/components/rodape";
import WhatsAppFlutuante from "@/components/whatsapp-flutuante";
import Botao from "@/components/botao";
import CardProduto, { CATEGORIA_EN_PLURAL } from "@/components/card-produto";

type Ordem = "destaques" | "menor" | "maior" | "nome";

/** Busca sem acento e sem caixa: "trapezio" acha "Trapézio". */
const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function lerUrl() {
  try {
    const q = new URLSearchParams(window.location.search);
    const categoria = q.get("categoria") ?? "";
    return {
      categoria: (CATEGORIAS.some((c) => c.id === categoria) ? categoria : "") as CategoriaId | "",
      busca: q.get("busca") ?? "",
    };
  } catch {
    return { categoria: "" as const, busca: "" };
  }
}

function ordenar(lista: Produto[], ordem: Ordem, idioma: string) {
  const copia = [...lista];
  // Sem preço ("sob consulta") vai para o fim quando a ordem é por preço
  const preco = (p: Produto, vazio: number) => p.precoCentavos ?? vazio;
  if (ordem === "menor") return copia.sort((a, b) => preco(a, Infinity) - preco(b, Infinity));
  if (ordem === "maior") return copia.sort((a, b) => preco(b, -Infinity) - preco(a, -Infinity));
  if (ordem === "nome") return copia.sort((a, b) => a.nome.localeCompare(b.nome, idioma === "en" ? "en" : "pt-BR"));
  // Destaques primeiro; dentro de cada grupo, a ordem definida no painel
  return [...copia.filter((p) => p.destaque), ...copia.filter((p) => !p.destaque)];
}

/**
 * Página com todos os produtos (/loja). Filtro por categoria, busca e ordem;
 * categoria e busca vão para a URL, então dá para mandar o link já filtrado
 * (ex.: /loja?categoria=kites).
 *
 * FALTA: como a vitrine, só mostra o que foi cadastrado neste navegador até a
 * loja ser ligada ao Supabase.
 */
export default function PaginaLoja() {
  const { idioma, t } = useIdioma();
  const [produtos, setProdutos] = useState<Produto[] | null>(null);
  const [erro, setErro] = useState(false);
  const [filtro, setFiltro] = useState(() => lerUrl());
  const [ordem, setOrdem] = useState<Ordem>("destaques");

  useEffect(() => {
    const carregar = () =>
      loja
        .listar()
        .then((lista) => {
          setProdutos(lista);
          setErro(false);
        })
        .catch(() => {
          setProdutos([]);
          setErro(true);
        });
    carregar();
    return loja.ouvir(carregar);
  }, []);

  // Filtro na URL, sem criar entrada no histórico a cada letra
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      for (const [chave, valor] of Object.entries(filtro)) {
        if (valor.trim()) q.set(chave, valor.trim());
        else q.delete(chave);
      }
      const busca = q.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${busca ? `?${busca}` : ""}`);
    } catch {
      // sem histórico: o filtro vale só na tela
    }
  }, [filtro]);

  const contagem = useMemo(() => {
    const m = new Map<CategoriaId, number>();
    for (const p of produtos ?? []) m.set(p.categoria, (m.get(p.categoria) ?? 0) + 1);
    return m;
  }, [produtos]);

  const lista = useMemo(() => {
    const termo = normalizar(filtro.busca.trim());
    const filtrados = (produtos ?? []).filter(
      (p) =>
        (!filtro.categoria || p.categoria === filtro.categoria) &&
        (!termo || normalizar(`${p.nome} ${p.descricao} ${p.opcoes.join(" ")}`).includes(termo)),
    );
    return ordenar(filtrados, ordem, idioma);
  }, [produtos, filtro, ordem, idioma]);

  // Só aparecem as categorias que têm produto
  const categorias = CATEGORIAS.filter((c) => contagem.get(c.id));
  const temFiltro = Boolean(filtro.categoria || filtro.busca.trim());
  const limpar = () => setFiltro({ categoria: "", busca: "" });
  const total = produtos?.length ?? 0;

  return (
    <>
      <Navbar pagina="loja" />
      <main>
        {/* Topo em painel, como o hero: a navbar transparente lê branco sobre ele */}
        <section className="p-2 sm:p-3">
          <div className="relative isolate overflow-hidden rounded-painel bg-ceu">
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,43,0.45)_0%,rgba(6,34,43,0.05)_100%)]" />
            <div className="shell pb-12 pt-32 text-white sm:pb-16 sm:pt-40">
              <p className="rotulo">TS Kite Shop</p>
              <h1 className="titulo entrar mt-5 max-w-3xl text-[2.5rem] sm:text-6xl">
                {t("Todos os produtos", "All products")} <span className="suave">{t("da loja", "in the shop")}</span>
              </h1>
              <p className="entrar mt-5 max-w-xl leading-relaxed text-white/90" style={{ animationDelay: "0.12s" }}>
                {t(
                  "Kites, pranchas, foil e acessórios com a parceria North Kiteboarding. Na dúvida do tamanho, a equipe indica pelo WhatsApp.",
                  "Kites, boards, foil and accessories through our North Kiteboarding partnership. Not sure about sizes? The team will advise you on WhatsApp.",
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="shell">
            {/* Filtros */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label={t("Filtrar por categoria", "Filter by category")}>
                {[{ id: "" as const, plural: t("Todos", "All") }, ...categorias].map((c) => {
                  const ativo = filtro.categoria === c.id;
                  const n = c.id ? contagem.get(c.id) : total;
                  return (
                    <button
                      key={c.id || "todos"}
                      type="button"
                      aria-pressed={ativo}
                      onClick={() => setFiltro((f) => ({ ...f, categoria: c.id }))}
                      className={`min-h-[44px] shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors ${ativo ? "bg-mar text-white" : "bg-pilula text-mar hover:bg-[#D8E2E2]"}`}
                    >
                      {c.id ? t(c.plural, CATEGORIA_EN_PLURAL[c.id]) : c.plural}
                      {n ? <span className="ml-1.5 opacity-60">{n}</span> : null}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <label className="relative flex-1 lg:w-64 lg:flex-none">
                  <span className="sr-only">{t("Buscar produto", "Search products")}</span>
                  <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-maré" />
                  <input
                    type="search"
                    value={filtro.busca}
                    onChange={(e) => setFiltro((f) => ({ ...f, busca: e.target.value }))}
                    placeholder={t("Buscar produto", "Search products")}
                    className="h-11 w-full rounded-full bg-bandeja pl-10 pr-4 text-[16px] outline-none focus:ring-2 focus:ring-mar"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">{t("Ordenar por", "Sort by")}</span>
                  <select
                    value={ordem}
                    onChange={(e) => setOrdem(e.target.value as Ordem)}
                    className="h-11 cursor-pointer appearance-none rounded-full bg-bandeja pl-4 pr-9 text-[15px] outline-none focus:ring-2 focus:ring-mar"
                  >
                    <option value="destaques">{t("Destaques", "Featured")}</option>
                    <option value="menor">{t("Menor preço", "Lowest price")}</option>
                    <option value="maior">{t("Maior preço", "Highest price")}</option>
                    <option value="nome">{t("Nome (A–Z)", "Name (A–Z)")}</option>
                  </select>
                  <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-maré">
                    <path d="M2 4.5 6 8l4-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </label>
              </div>
            </div>

            {produtos !== null && produtos.length > 0 && (
              <p aria-live="polite" className="mt-5 text-sm text-maré">
                {lista.length === 1 ? t("1 produto", "1 product") : t(`${lista.length} produtos`, `${lista.length} products`)}
                {temFiltro && (
                  <button type="button" onClick={limpar} className="ml-3 inline-flex items-center gap-1 font-medium text-mar underline decoration-sol decoration-2 underline-offset-4">
                    <X aria-hidden className="h-3.5 w-3.5" /> {t("Limpar filtros", "Clear filters")}
                  </button>
                )}
              </p>
            )}

            {/* Lista */}
            {produtos === null ? (
              <ul aria-label={t("Carregando produtos", "Loading products")} className="mt-5 grid grid-cols-2 gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <li key={i} className="rounded-3xl bg-white p-2 sm:p-3">
                    <div className="aspect-square animate-pulse rounded-2xl bg-bandeja" />
                    <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-bandeja" />
                    <div className="mb-2 mt-2 h-4 w-1/3 animate-pulse rounded-full bg-bandeja" />
                  </li>
                ))}
              </ul>
            ) : lista.length > 0 ? (
              <ul className="mt-5 grid grid-cols-2 gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 md:grid-cols-3 xl:grid-cols-4">
                {lista.map((p, i) => (
                  <CardProduto key={p.id} p={p} ate="md" deitado={lista.length % 2 === 1 && i === lista.length - 1} />
                ))}
              </ul>
            ) : (
              <div className="mt-5 rounded-painel bg-bandeja p-10 text-center">
                <p className="titulo text-2xl">
                  {erro
                    ? t("Não foi possível carregar os produtos", "We couldn't load the products")
                    : total === 0
                      ? t("Produtos chegando em breve", "Products coming soon")
                      : t("Nada encontrado", "Nothing found")}
                </p>
                <p className="mx-auto mt-2 max-w-sm text-maré">
                  {total === 0
                    ? t("Enquanto isso, fale com a equipe: a gente diz o que tem na loja hoje.", "Meanwhile, talk to the team: we'll tell you what's in the shop today.")
                    : t("Tente outra palavra ou outra categoria.", "Try another word or category.")}
                </p>
                {temFiltro && total > 0 && (
                  <button type="button" onClick={limpar} className="mt-6 h-11 rounded-full bg-mar px-6 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-white">
                    {t("Ver todos", "See all")}
                  </button>
                )}
              </div>
            )}

            {/* Não achou */}
            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-painel bg-mar p-6 text-white sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="titulo text-2xl sm:text-3xl">{t("Não achou o que procura?", "Can't find what you need?")}</p>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-white/80">
                  {t(
                    "Nem tudo da loja está no site. Diga o que precisa e a equipe confere o estoque e o tamanho certo para você.",
                    "Not everything in the shop is online. Tell us what you need and the team will check stock and the right size for you.",
                  )}
                </p>
              </div>
              <Botao
                href={linkWhatsApp(t("Olá! Vim pela loja do site e estou procurando um equipamento.", "Hi! I came from the website shop and I'm looking for some gear."))}
                externo
              >
                {t("Falar com a equipe", "Talk to the team")}
              </Botao>
            </div>
          </div>
        </section>
      </main>
      <Rodape pagina="loja" />
      <WhatsAppFlutuante />
    </>
  );
}
