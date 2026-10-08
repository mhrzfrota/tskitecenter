import { useEffect, useMemo, useRef, useState, type ReactNode, type TouchEvent } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, MapPin, MessageCircle, ShieldCheck, Wind } from "lucide-react";
import { ESCOLA, linkWhatsApp } from "@/marca";
import { idDoEndereco, linkProduto, loja, nomeCategoria, nomeDaCor, proporcaoDaFoto, relacionados, separarDetalhe, type Produto } from "@/loja";
import { ProvedorIdioma, useIdioma, type Meta } from "@/idioma";
import Navbar from "@/components/navbar";
import Rodape from "@/components/rodape";
import WhatsAppFlutuante from "@/components/whatsapp-flutuante";
import Botao from "@/components/botao";
import { Bolinha, CATEGORIA_EN, CATEGORIA_EN_PLURAL, usePreco } from "@/components/card-produto";
import GradeProdutos from "@/components/grade-produtos";
import FotoLoja from "@/admin/FotoLoja";

type Estado = { tipo: "carregando" } | { tipo: "ok"; produto: Produto; todos: Produto[] } | { tipo: "nao-encontrado" };

/**
 * Página de um produto (/produto/<id>), na estrutura da página de produto da
 * North: galeria com miniaturas, nome e preço, cor, tamanho, estoque, botão
 * e as sanfonas de descrição e especificações. A compra fecha no WhatsApp,
 * com cor e tamanho já escritos na mensagem.
 *
 * Lê o catálogo fixo (src/loja/catalogo.ts) até a loja ir ao Supabase.
 */
export default function App() {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const id = useMemo(() => idDoEndereco(window.location.pathname, window.location.search), []);

  useEffect(() => {
    const carregar = () =>
      Promise.all([id ? loja.obter(id) : Promise.resolve(null), loja.listar()])
        .then(([produto, todos]) => setEstado(produto && produto.ativo ? { tipo: "ok", produto, todos } : { tipo: "nao-encontrado" }))
        .catch(() => setEstado({ tipo: "nao-encontrado" }));
    carregar();
    return loja.ouvir(carregar);
  }, [id]);

  // Título e descrição da aba seguem o produto
  const meta = useMemo<Meta>(() => {
    const p = estado.tipo === "ok" ? estado.produto : null;
    const resumo = p?.descricao.slice(0, 150) || "";
    return {
      pt: { lang: "pt-BR", titulo: p ? `${p.nome} | TS Kite Shop` : "Produto | TS Kite Shop", descricao: resumo || "Equipamento de kitesurf na TS Kite Shop, no Cumbuco (CE). Parceria North Kiteboarding." },
      en: { lang: "en", titulo: p ? `${p.nome} | TS Kite Shop` : "Product | TS Kite Shop", descricao: resumo || "Kitesurf gear at TS Kite Shop in Cumbuco, Brazil. North Kiteboarding partner." },
    };
  }, [estado]);

  return (
    <ProvedorIdioma meta={meta}>
      <Navbar pagina="produto" />
      <main className="pt-24 sm:pt-28">
        {estado.tipo === "carregando" && <Carregando />}
        {estado.tipo === "nao-encontrado" && <NaoEncontrado />}
        {estado.tipo === "ok" && <Pagina key={estado.produto.id} p={estado.produto} todos={estado.todos} />}
      </main>
      <Rodape pagina="produto" />
      <WhatsAppFlutuante />
    </ProvedorIdioma>
  );
}

function Pagina({ p, todos }: { p: Produto; todos: Produto[] }) {
  const { t } = useIdioma();
  const preco = usePreco();
  const [foto, setFoto] = useState(0);
  const [cor, setCor] = useState(p.cores.length === 1 ? p.cores[0] : "");
  const [tamanho, setTamanho] = useState(p.opcoes.length === 1 ? p.opcoes[0] : "");
  const [faltando, setFaltando] = useState<string[]>([]);
  const toque = useRef<number | null>(null);
  const sugestoes = useMemo(() => relacionados(p, todos, 4), [p, todos]);
  const categoria = t(nomeCategoria(p.categoria), CATEGORIA_EN[p.categoria]);
  const fotos = p.fotos.length ? p.fotos : [undefined];
  const proporcao = proporcaoDaFoto(fotos[foto]);

  const trocarFoto = (passo: number) => setFoto((f) => (f + passo + fotos.length) % fotos.length);
  const fimToque = (e: TouchEvent) => {
    if (toque.current === null) return;
    const dx = e.changedTouches[0].clientX - toque.current;
    toque.current = null;
    if (Math.abs(dx) > 50) trocarFoto(dx < 0 ? 1 : -1);
  };

  const endereco = `${window.location.origin}${linkProduto(p.id)}`;
  const mensagem = () => {
    const linhas = p.disponivel
      ? [t(`Olá! Quero comprar: ${p.nome}`, `Hi! I'd like to buy: ${p.nome}`)]
      : [t(`Olá! Quero ser avisado quando chegar: ${p.nome}`, `Hi! Please let me know when this is back: ${p.nome}`)];
    if (cor) linhas.push(`${t("Cor", "Colour")}: ${nomeDaCor(cor)}`);
    if (tamanho) linhas.push(`${t("Tamanho", "Size")}: ${tamanho}`);
    if (p.precoCentavos !== null) linhas.push(`${t("Valor", "Price")}: ${preco(p.precoCentavos)}`);
    linhas.push(endereco);
    return linhas.join("\n");
  };

  function comprar() {
    const falta = [p.cores.length > 1 && !cor ? "cor" : "", p.opcoes.length > 1 && !tamanho ? "tamanho" : ""].filter(Boolean);
    setFaltando(falta);
    if (falta.length && p.disponivel) return;
    window.open(linkWhatsApp(mensagem()), "_blank", "noopener");
  }

  return (
    <>
      <div className="shell">
        {/* Caminho */}
        <nav aria-label={t("Você está em", "You are here")} className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-maré">
          <a href="/loja" className="hover:text-mar">{t("Loja", "Shop")}</a>
          <ChevronRight aria-hidden className="h-3 w-3" />
          <a href={`/loja?categoria=${p.categoria}`} className="hover:text-mar">{t(nomeCategoria(p.categoria), CATEGORIA_EN_PLURAL[p.categoria])}</a>
          <ChevronRight aria-hidden className="h-3 w-3" />
          <span className="max-w-[50vw] truncate text-mar">{p.nome}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          {/* Galeria: miniaturas na lateral (no celular, embaixo) */}
          <div className="flex flex-col-reverse gap-3 lg:sticky lg:top-28 lg:flex-row lg:self-start">
            {fotos.length > 1 && (
              <ul className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[600px] lg:flex-col lg:overflow-y-auto lg:pb-0" aria-label={t("Fotos", "Photos")}>
                {fotos.map((f, i) => (
                  <li key={f ?? i} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setFoto(i)}
                      aria-label={t(`Foto ${i + 1}`, `Photo ${i + 1}`)}
                      aria-current={i === foto}
                      // Miniatura na proporção da foto (altura fixa), como a foto grande
                      style={proporcaoDaFoto(f) ? { aspectRatio: String(proporcaoDaFoto(f)) } : undefined}
                      className={`block h-[72px] overflow-hidden rounded-lg bg-nevoa ring-2 transition-[box-shadow] sm:h-20 ${proporcaoDaFoto(f) ? "w-auto" : "w-[72px] sm:w-20"} ${i === foto ? "ring-mar" : "ring-transparent hover:ring-mar/25"}`}
                    >
                      <FotoLoja id={f} alt="" fundo="bg-nevoa" className="h-full w-full" imgClassName={proporcaoDaFoto(f) ? "" : "p-1.5 mix-blend-multiply"} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div
              className={`relative min-w-0 flex-1 overflow-hidden rounded-cartao bg-nevoa ${proporcao ? "" : "aspect-square"}`}
              style={proporcao ? { aspectRatio: String(proporcao) } : undefined}
              onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
              onTouchEnd={fimToque}
            >
              <FotoLoja id={fotos[foto]} alt={p.nome} fundo="bg-nevoa" className="h-full w-full" imgClassName={proporcao ? "" : "p-[8%] mix-blend-multiply"} />
              {!p.disponivel && (
                <span className="absolute left-4 top-4 rounded-full bg-mar px-3 py-1.5 text-[11px] font-semibold text-white">{t("Esgotado", "Sold out")}</span>
              )}
              {fotos.length > 1 && (
                <>
                  <button type="button" onClick={() => trocarFoto(-1)} aria-label={t("Foto anterior", "Previous photo")} className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm hover:bg-white sm:grid">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => trocarFoto(1)} aria-label={t("Próxima foto", "Next photo")} className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm hover:bg-white sm:grid">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold tabular-nums">
                    {foto + 1} / {fotos.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Compra */}
          <div className="min-w-0">
            <p className="rotulo text-maré">{categoria}</p>
            <h1 className="titulo mt-3 text-[2.1rem] sm:text-5xl">{p.nome}</h1>

            <p className={`mt-5 ${p.precoCentavos !== null ? "text-[2.6rem] font-semibold leading-none tracking-[-0.05em] text-mar sm:text-[3.4rem]" : "text-2xl font-medium text-maré"}`}>
              {preco(p.precoCentavos)}
            </p>
            {p.precoCentavos === null && <p className="mt-2 text-sm text-maré">{t("Fale com a equipe para saber o valor e a disponibilidade.", "Talk to the team for price and availability.")}</p>}

            <p className="mt-4 flex items-center gap-2 text-[15px] font-medium">
              <span className={`h-2.5 w-2.5 rounded-full ${p.disponivel ? "bg-emerald-500" : "bg-maré/50"}`} aria-hidden />
              {p.disponivel ? t("Disponível na loja", "Available in the shop") : t("Esgotado no momento", "Currently sold out")}
            </p>

            {/* Cor */}
            {p.cores.length > 0 && (
              <fieldset className="mt-8">
                <legend className="flex w-full items-baseline gap-2 text-[12px] font-semibold uppercase tracking-[0.14em]">
                  {t("Selecionar cor", "Select colour")}
                  <span className="normal-case tracking-normal text-maré">{cor ? nomeDaCor(cor) : ""}</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2.5" role="radiogroup" aria-label={t("Cor", "Colour")}>
                  {p.cores.map((c) => {
                    const marcada = cor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={marcada}
                        aria-label={nomeDaCor(c)}
                        title={nomeDaCor(c)}
                        onClick={() => { setCor(c); setFaltando((f) => f.filter((x) => x !== "cor")); }}
                        className={`grid h-12 w-12 place-items-center rounded-full ring-2 ring-offset-2 transition-[box-shadow] ${marcada ? "ring-mar" : "ring-transparent hover:ring-mar/25"}`}
                      >
                        <Bolinha cor={c} tamanho="h-10 w-10" />
                      </button>
                    );
                  })}
                </div>
                {faltando.includes("cor") && <p className="mt-2 text-sm font-medium text-red-700">{t("Escolha a cor.", "Choose a colour.")}</p>}
              </fieldset>
            )}

            {/* Tamanho */}
            {p.opcoes.length > 0 && (
              <fieldset className="mt-7">
                <legend className="flex w-full items-baseline justify-between gap-2 text-[12px] font-semibold uppercase tracking-[0.14em]">
                  <span>
                    {t("Selecionar tamanho", "Select size")} <span className="normal-case tracking-normal text-maré">{tamanho}</span>
                  </span>
                  <a
                    href={linkWhatsApp(t(`Olá! Qual tamanho do ${p.nome} é o certo para mim?`, `Hi! Which size of the ${p.nome} is right for me?`))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="normal-case tracking-normal text-mar underline decoration-sol decoration-2 underline-offset-4"
                  >
                    {t("Qual é o meu tamanho?", "Which size is mine?")}
                  </a>
                </legend>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={t("Tamanho", "Size")}>
                  {p.opcoes.map((o) => {
                    const marcado = tamanho === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        role="radio"
                        aria-checked={marcado}
                        onClick={() => { setTamanho(o); setFaltando((f) => f.filter((x) => x !== "tamanho")); }}
                        className={`h-12 rounded-xl border text-[15px] font-medium transition-colors ${marcado ? "border-mar bg-mar text-white" : "border-mar/15 bg-white hover:border-mar/50"}`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
                {faltando.includes("tamanho") && <p className="mt-2 text-sm font-medium text-red-700">{t("Escolha o tamanho.", "Choose a size.")}</p>}
              </fieldset>
            )}

            {/* Ação */}
            <div className="mt-8 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={comprar}
                className={`flex h-14 items-center justify-center gap-2 rounded-full text-[16px] font-semibold transition-colors ${p.disponivel ? "bg-sol text-mar hover:bg-[#EDD45A]" : "bg-mar text-white hover:bg-mar-2"}`}
              >
                <MessageCircle className="h-5 w-5" />
                {p.disponivel ? t("Comprar pelo WhatsApp", "Buy on WhatsApp") : t("Avise-me quando chegar", "Notify me when it's back")}
              </button>
              <p className="text-center text-[13px] text-maré">
                {t("A equipe confirma estoque, cor e tamanho e fecha a compra com você.", "The team confirms stock, colour and size and closes the purchase with you.")}
              </p>
            </div>

            <ul className="mt-6 divide-y divide-mar/10 border-y border-mar/10 text-[14.5px]">
              <li className="flex items-center gap-3 py-3.5"><ShieldCheck className="h-5 w-5 shrink-0 text-lagoa-forte" /> {t("Parceria oficial North Kiteboarding", "Official North Kiteboarding partner")}</li>
              <li className="flex items-center gap-3 py-3.5"><Wind className="h-5 w-5 shrink-0 text-lagoa-forte" /> {t("Indicação de quem veleja todo dia no Cumbuco", "Advice from riders who are on the water every day in Cumbuco")}</li>
              <li className="flex items-center gap-3 py-3.5">
                <MapPin className="h-5 w-5 shrink-0 text-lagoa-forte" />
                <a href="/#localizacao" className="underline decoration-sol decoration-2 underline-offset-4">{ESCOLA.endereco}</a>
              </li>
            </ul>

            {/* Sanfonas */}
            <div className="mt-6 divide-y divide-mar/10 border-b border-mar/10">
              {p.descricao && (
                <Sanfona titulo={t("Descrição", "Description")} aberta>
                  <p className="whitespace-pre-line leading-relaxed text-mar/85">{p.descricao}</p>
                </Sanfona>
              )}
              {p.detalhes.length > 0 && (
                <Sanfona titulo={t("Especificações", "Specifications")} aberta={!p.descricao}>
                  <Especificacoes detalhes={p.detalhes} />
                </Sanfona>
              )}
              <Sanfona titulo={t("Dúvidas", "Questions")}>
                <p className="leading-relaxed text-mar/85">
                  {t(
                    "Não sabe se é o equipamento certo para o seu nível ou para o vento do Cumbuco? Fale com a equipe antes de comprar.",
                    "Not sure it's the right gear for your level or for Cumbuco's wind? Talk to the team before buying.",
                  )}
                </p>
                <a
                  href={linkWhatsApp(t(`Olá! Tenho uma dúvida sobre o ${p.nome}.`, `Hi! I have a question about the ${p.nome}.`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-10 items-center rounded-full px-4 text-[14px] font-semibold ring-1 ring-inset ring-mar/20 hover:bg-mar/5"
                >
                  {t("Tirar dúvida", "Ask a question")}
                </a>
              </Sanfona>
            </div>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {sugestoes.length > 0 && (
        <section className="mt-20 py-6 sm:mt-28">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="titulo text-3xl sm:text-4xl">
                {t("Você também", "You may")} <span className="suave">{t("pode gostar", "also like")}</span>
              </h2>
              <a href="/loja" className="text-[14px] font-semibold underline decoration-sol decoration-2 underline-offset-4">
                {t("Ver toda a loja", "See the whole shop")}
              </a>
            </div>
            <GradeProdutos produtos={sugestoes} colunas={{ base: 2, lg: 4 }} className="mt-8" />
          </div>
        </section>
      )}
    </>
  );
}

function Sanfona({ titulo, aberta = false, children }: { titulo: string; aberta?: boolean; children: ReactNode }) {
  return (
    <details open={aberta} className="group py-1">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[13px] font-semibold uppercase tracking-[0.14em] [&::-webkit-details-marker]:hidden">
        {titulo}
        <ChevronDown aria-hidden className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

/** "Rótulo: valor" vira tabela; o resto vira lista com check. */
function Especificacoes({ detalhes }: { detalhes: string[] }) {
  const partes = detalhes.map(separarDetalhe);
  const tabela = partes.filter((d): d is { rotulo: string; valor: string } => "rotulo" in d);
  const itens = partes.filter((d): d is { texto: string } => "texto" in d);
  return (
    <div className="space-y-4">
      {tabela.length > 0 && (
        <dl className="overflow-hidden rounded-lg bg-nevoa">
          {tabela.map((d, i) => (
            <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 px-4 py-3 text-[14.5px] odd:bg-white/60">
              <dt className="text-maré">{d.rotulo}</dt>
              <dd className="font-medium">{d.valor}</dd>
            </div>
          ))}
        </dl>
      )}
      {itens.length > 0 && (
        <ul className="space-y-2">
          {itens.map((d, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-mar/85">
              <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-lagoa-forte" /> {d.texto}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Carregando() {
  return (
    <div className="shell grid gap-8 lg:grid-cols-2" aria-label="Carregando">
      <div className="aspect-square animate-pulse rounded-cartao bg-nevoa" />
      <div className="space-y-4 pt-4">
        <div className="h-4 w-24 animate-pulse rounded-full bg-bandeja" />
        <div className="h-12 w-3/4 animate-pulse rounded-lg bg-nevoa" />
        <div className="h-14 w-1/2 animate-pulse rounded-lg bg-nevoa" />
      </div>
    </div>
  );
}

function NaoEncontrado() {
  const { t } = useIdioma();
  return (
    <div className="shell py-16 text-center">
      <p className="titulo text-4xl">{t("Produto não encontrado", "Product not found")}</p>
      <p className="mx-auto mt-3 max-w-md text-maré">{t("Ele pode ter saído da loja. Veja o que temos hoje ou fale com a equipe.", "It may no longer be in the shop. See what we have today or talk to the team.")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Botao href="/loja" variante="mar">{t("Ver a loja", "See the shop")}</Botao>
        <Botao href={linkWhatsApp(t("Olá! Estou procurando um equipamento.", "Hi! I'm looking for some gear."))} externo>{t("Falar com a equipe", "Talk to the team")}</Botao>
      </div>
    </div>
  );
}
