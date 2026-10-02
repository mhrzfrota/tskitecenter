import { useEffect, useState } from "react";
import { ESCOLA, linkWhatsApp } from "@/marca";
import { formatarPreco, loja, nomeCategoria, type CategoriaId, type Produto as ProdutoLoja } from "@/loja";
import { useIdioma } from "@/idioma";
import FotoLoja from "@/admin/FotoLoja";
import Botao from "./botao";
import Cabecalho from "./cabecalho";
import Foto from "./foto";

type Exemplo = { categoria: string; nome: string; foto: string };

// Nome das categorias do painel na versão em inglês do site
const CATEGORIA_EN: Record<CategoriaId, string> = {
  kites: "Kite",
  pranchas: "Board",
  foil: "Foil",
  trapezios: "Harness",
  bones: "Cap",
  vestuario: "Apparel",
  acessorios: "Accessory",
};

/**
 * Vitrine da loja: duas fileiras de três, na bandeja cinza.
 *
 * Os produtos vêm do painel (/admin): destaques primeiro, depois a ordem da
 * vitrine. As fotos chegam recortadas em fundo branco; o multiply troca esse
 * branco pelo cinza do quadro, e o produto parece pousado nele, sem moldura.
 * No celular, se sobrar um card sozinho na última fileira, ele deita (foto ao
 * lado do texto) e ocupa a linha inteira. Enquanto nada foi cadastrado, ficam os exemplos abaixo, só para a
 * seção não nascer vazia.
 *
 * FALTA: hoje o cadastro fica no navegador de quem cadastrou (sem Supabase).
 * O visitante só vai ver os produtos reais quando a loja for ligada ao banco.
 */
const EXEMPLOS: { pt: Exemplo[]; en: Exemplo[] } = {
  pt: [
    { categoria: "Kites", nome: "Kite", foto: "Kite aberto na areia, fundo limpo" },
    { categoria: "Pranchas", nome: "Prancha twin tip", foto: "Prancha twin tip em pé, fundo limpo" },
    { categoria: "Barras", nome: "Barra de controle", foto: "Barra de controle com linhas" },
    { categoria: "Trapézios", nome: "Trapézio", foto: "Trapézio de kite" },
    { categoria: "Foil", nome: "Wing", foto: "Asa de wingfoil inflada" },
    { categoria: "Vestuário", nome: "Lycra TS", foto: "Lycra com a marca TS" },
  ],
  en: [
    { categoria: "Kites", nome: "Kite", foto: "Kite laid out on the sand, clean background" },
    { categoria: "Boards", nome: "Twin tip board", foto: "Twin tip board standing up, clean background" },
    { categoria: "Bars", nome: "Control bar", foto: "Control bar with lines" },
    { categoria: "Harnesses", nome: "Harness", foto: "Kite harness" },
    { categoria: "Foil", nome: "Wing", foto: "Inflated wingfoil wing" },
    { categoria: "Apparel", nome: "TS rash guard", foto: "Rash guard with the TS logo" },
  ],
};

const VITRINE = 6;

function useVitrine() {
  const [produtos, setProdutos] = useState<ProdutoLoja[]>([]);
  useEffect(() => {
    const carregar = () =>
      loja
        .listar()
        .then((todos) => setProdutos([...todos.filter((p) => p.destaque), ...todos.filter((p) => !p.destaque)].slice(0, VITRINE)))
        .catch(() => setProdutos([]));
    carregar();
    return loja.ouvir(carregar);
  }, []);
  return produtos;
}

const botaoConsultar =
  "inline-flex h-10 items-center self-start rounded-full bg-pilula px-4 font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#D8E2E2]";

export default function Produtos() {
  const reais = useVitrine();
  const { idioma, t } = useIdioma();
  const preco = (centavos: number | null) =>
    idioma === "en"
      ? centavos === null
        ? "Price on request"
        : (centavos / 100).toLocaleString("en-US", { style: "currency", currency: "BRL" })
      : formatarPreco(centavos);

  return (
    <section id="loja" className="py-16 sm:py-24">
      <div className="shell">
        <Cabecalho
          rotulo="TS Kite Shop"
          apoio={t(
            "Parceria North Kiteboarding, com quem veleja todo dia para indicar o equipamento certo.",
            "North Kiteboarding partner, with riders who are on the water every day to recommend the right gear.",
          )}
        >
          {t("Equipamento de ponta", "Top-level gear")} <span className="suave">{t("para a sua sessão", "for your session")}</span>
        </Cabecalho>

        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 lg:grid-cols-3">
          {reais.length > 0
            ? reais.map((p, i) => {
                const sozinho = reais.length % 2 === 1 && i === reais.length - 1;
                return (
                <li
                  key={p.id}
                  className={`group flex rounded-3xl bg-white p-2 sm:p-3 ${sozinho ? "col-span-2 flex-row items-stretch lg:col-span-1 lg:flex-col" : "flex-col"}`}
                >
                  <div className={`relative aspect-square shrink-0 overflow-hidden rounded-2xl ${sozinho ? "w-[calc(50%-4px)] sm:w-[calc(50%-6px)] lg:w-full" : ""}`}>
                    <FotoLoja
                      id={p.fotos[0]}
                      alt={p.nome}
                      fundo="bg-bandeja"
                      className="h-full w-full"
                      imgClassName="p-[9%] mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    {!p.disponivel && (
                      <span className="absolute left-2 top-2 rounded-full bg-mar px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white">{t("Esgotado", "Sold out")}</span>
                    )}
                  </div>
                  <div className={`flex min-w-0 flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3 ${sozinho ? "max-lg:justify-center max-lg:pl-4 max-lg:pt-2" : ""}`}>
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
              })
            : EXEMPLOS[idioma].map((p) => (
                <li key={p.nome} className="group flex flex-col rounded-3xl bg-white p-2 sm:p-3">
                  <div className="aspect-square overflow-hidden rounded-2xl">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                      <Foto descricao={p.foto} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-maré">{p.categoria}</p>
                    <h3 className="mt-1 text-lg font-medium tracking-[-0.03em] sm:text-xl">{p.nome}</h3>
                    <p className="mt-0.5 text-sm text-maré">{preco(null)}</p>
                    <a
                      href={linkWhatsApp(t(`Olá! Tenho interesse no produto: ${p.nome}.`, `Hi! I'm interested in this product: ${p.nome}.`))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${botaoConsultar} mt-4`}
                    >
                      {t("Consultar", "Ask us")}
                    </a>
                  </div>
                </li>
              ))}
        </ul>

        <div className="mt-10 flex justify-center">
          {/* FALTA: trocar pela página /loja quando existir */}
          <Botao href={ESCOLA.loja} externo variante="mar">
            {t("Ver todos os produtos", "See all products")}
          </Botao>
        </div>
      </div>
    </section>
  );
}
