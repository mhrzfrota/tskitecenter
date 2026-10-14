import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import { CATEGORIAS, loja, type CategoriaId, type Produto } from "@/loja";
import { useIdioma } from "@/idioma";
import Navbar from "@/components/navbar";
import Rodape from "@/components/rodape";
import WhatsAppFlutuante from "@/components/whatsapp-flutuante";
import Botao from "@/components/botao";
import { CATEGORIA_EN_PLURAL } from "@/components/card-produto";
import GradeProdutos from "@/components/grade-produtos";

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
 * Os produtos vêm do catálogo fixo (src/loja/catalogo.ts) até a loja ir ao
 * Supabase; o que é cadastrado no painel ainda não aparece aqui.
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
        {/* Topo com foto (a kite North Reach da escola) sob um véu do mar à noite, emendado na barra */}
        <section className="relative isolate overflow-hidden bg-abismo text-white">
          <img
            src="/fotos/aula-kite-reach.webp"
            alt=""
            aria-hidden
            {...{ fetchpriority: "high" }}
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[78%_center]"
          />
          {/* Véu: escuro embaixo no celular; da esquerda para a direita no computador, deixando a kite aparecer */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,22,28,0.6)_0%,rgba(3,22,28,0.78)_55%,rgba(3,22,28,0.95)_100%)] md:bg-[linear-gradient(90deg,rgba(3,22,28,0.94)_0%,rgba(3,22,28,0.78)_42%,rgba(3,22,28,0.2)_100%)]" />
          <div className="shell pb-14 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-44">
            <nav aria-label={t("Você está em", "You are here")} className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/75">
              <a href="/" className="hover:text-white">{t("Início", "Home")}</a>
              <ChevronRight aria-hidden className="h-3 w-3" />
              <span className="text-white">TS Kite Shop</span>
            </nav>
            <h1 className="titulo entrar mt-5 max-w-4xl text-[2.5rem] sm:text-6xl lg:text-[4.5rem]">
              {t("Todos os produtos", "All products")} <span className="font-normal text-white/70">{t("da loja", "in the shop")}</span>
            </h1>
            <p className="entrar mt-5 max-w-xl leading-relaxed text-white/90" style={{ animationDelay: "0.12s" }}>
              {t(
                "Kites, pranchas, foil e acessórios com a parceria North Kiteboarding. Na dúvida do tamanho, a equipe indica pelo WhatsApp.",
                "Kites, boards, foil and accessories through our North Kiteboarding partnership. Not sure about sizes? The team will advise you on WhatsApp.",
              )}
            </p>
            <ul className="entrar mt-8 flex flex-wrap gap-2 text-[13px] font-semibold" style={{ animationDelay: "0.18s" }}>
              {total > 0 && (
                <li className="rounded-full bg-sol px-3.5 py-1.5 text-mar">
                  {total} {t(total === 1 ? "produto" : "produtos", total === 1 ? "product" : "products")}
                </li>
              )}
              <li className="rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-inset ring-white/25 backdrop-blur-sm">{t("Parceria North Kiteboarding", "North Kiteboarding partner")}</li>
              <li className="rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-inset ring-white/25 backdrop-blur-sm">{t("Compra pelo WhatsApp", "Buy on WhatsApp")}</li>
            </ul>
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
                      className={`min-h-[44px] shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors ${ativo ? "bg-mar text-white" : "text-mar ring-1 ring-inset ring-mar/15 hover:bg-mar/5"}`}
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
                    className="h-11 w-full rounded-full bg-nevoa pl-10 pr-4 text-[16px] outline-none focus:ring-2 focus:ring-mar"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">{t("Ordenar por", "Sort by")}</span>
                  <select
                    value={ordem}
                    onChange={(e) => setOrdem(e.target.value as Ordem)}
                    className="h-11 cursor-pointer appearance-none rounded-full bg-nevoa pl-4 pr-9 text-[15px] outline-none focus:ring-2 focus:ring-mar"
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
              <ul aria-label={t("Carregando produtos", "Loading products")} className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <li key={i}>
                    <div className="aspect-square animate-pulse rounded-cartao bg-nevoa" />
                    <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-nevoa" />
                    <div className="mb-2 mt-2 h-4 w-1/3 animate-pulse rounded-full bg-nevoa" />
                  </li>
                ))}
              </ul>
            ) : lista.length > 0 ? (
              <GradeProdutos produtos={lista} colunas={{ base: 2, md: 3, xl: 4 }} className="mt-5" />
            ) : (
              <div className="mt-5 rounded-cartao bg-nevoa p-10 text-center">
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
                  <button type="button" onClick={limpar} className="mt-6 h-11 rounded-full bg-mar px-6 text-[14px] font-semibold text-white">
                    {t("Ver todos", "See all")}
                  </button>
                )}
              </div>
            )}

            {/* Não achou */}
            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-cartao bg-oceano p-6 text-white sm:flex-row sm:items-center sm:p-10">
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
