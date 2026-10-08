import { useEffect, useState } from "react";
import { linkWhatsApp } from "@/marca";
import { loja, type Produto as ProdutoLoja } from "@/loja";
import { useIdioma } from "@/idioma";
import Botao from "./botao";
import { botaoConsultar, usePreco } from "./card-produto";
import GradeProdutos from "./grade-produtos";
import Cabecalho from "./cabecalho";
import Foto from "./foto";

type Exemplo = { categoria: string; nome: string; foto: string };


/**
 * Vitrine da loja: "Discover the collection" da North. Cabeçalho com o link
 * para a loja inteira à direita e os produtos soltos no branco, sem bandeja.
 *
 * Os produtos vêm do catálogo fixo (src/loja/catalogo.ts): destaques
 * primeiro, depois a ordem do catálogo. O card é o mesmo da página /loja
 * (card-produto). Se o catálogo ficar vazio, entram os exemplos abaixo, só
 * para a seção não nascer vazia.
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

export default function Produtos() {
  const reais = useVitrine();
  const { idioma, t } = useIdioma();
  const preco = usePreco();

  return (
    <section id="loja" className="py-20 sm:py-28">
      <div className="shell">
        <Cabecalho
          rotulo="TS Kite Shop"
          apoio={t(
            "Parceria North Kiteboarding, com quem veleja todo dia para indicar o equipamento certo.",
            "North Kiteboarding partner, with riders who are on the water every day to recommend the right gear.",
          )}
          acao={
            <Botao href="/loja" variante="mar">
              {t("Ver todos os produtos", "See all products")}
            </Botao>
          }
        >
          {t("Equipamento de ponta", "Top-level gear")} <span className="suave">{t("para a sua sessão", "for your session")}</span>
        </Cabecalho>

        {reais.length > 0 ? (
          <GradeProdutos produtos={reais} colunas={{ base: 2, lg: 3 }} className="mt-14 sm:mt-16" />
        ) : (
        <ul className="mt-14 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-16 sm:gap-x-5 lg:grid-cols-3">
          {EXEMPLOS[idioma].map((p) => (
                <li key={p.nome} className="group flex flex-col">
                  <div className="aspect-square overflow-hidden rounded-cartao">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                      <Foto descricao={p.foto} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-maré">{p.categoria}</p>
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
        )}

      </div>
    </section>
  );
}
