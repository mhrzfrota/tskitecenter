import { useEffect, useState } from "react";
import { ESCOLA, linkWhatsApp } from "@/marca";
import { formatarPreco, loja, nomeCategoria, type Produto as ProdutoLoja } from "@/loja";
import FotoLoja from "@/admin/FotoLoja";
import Botao from "./botao";
import Cabecalho from "./cabecalho";
import Foto from "./foto";

type Exemplo = { categoria: string; nome: string; foto: string };

/**
 * Vitrine da loja: duas fileiras de três, na bandeja cinza.
 *
 * Os produtos vêm do painel (/admin): destaques primeiro, depois a ordem da
 * vitrine. Enquanto nada foi cadastrado, ficam os exemplos abaixo, só para a
 * seção não nascer vazia.
 *
 * FALTA: hoje o cadastro fica no navegador de quem cadastrou (sem Supabase).
 * O visitante só vai ver os produtos reais quando a loja for ligada ao banco.
 */
const EXEMPLOS: Exemplo[] = [
  { categoria: "Kites", nome: "Kite", foto: "Kite aberto na areia, fundo limpo" },
  { categoria: "Pranchas", nome: "Prancha twin tip", foto: "Prancha twin tip em pé, fundo limpo" },
  { categoria: "Barras", nome: "Barra de controle", foto: "Barra de controle com linhas" },
  { categoria: "Trapézios", nome: "Trapézio", foto: "Trapézio de kite" },
  { categoria: "Foil", nome: "Wing", foto: "Asa de wingfoil inflada" },
  { categoria: "Vestuário", nome: "Lycra TS", foto: "Lycra com a marca TS" },
];

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
  "mt-4 inline-flex h-10 items-center self-start rounded-full bg-pilula px-4 font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#D8E2E2]";

export default function Produtos() {
  const reais = useVitrine();

  return (
    <section id="loja" className="py-20 sm:py-28">
      <div className="shell">
        <Cabecalho rotulo="TS Kite Shop" apoio="Parceria North Kiteboarding, com quem veleja todo dia para indicar o equipamento certo.">
          Equipamento de ponta <span className="suave">para a sua sessão</span>
        </Cabecalho>

        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 lg:grid-cols-3">
          {reais.length > 0
            ? reais.map((p) => (
                <li key={p.id} className="group flex flex-col rounded-3xl bg-white p-2 sm:p-3">
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    {p.fotos[0] ? (
                      <FotoLoja id={p.fotos[0]} alt={p.nome} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <Foto descricao={`Foto de ${p.nome}`} />
                    )}
                    {!p.disponivel && (
                      <span className="absolute left-2 top-2 rounded-full bg-mar px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white">Esgotado</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-maré">{nomeCategoria(p.categoria)}</p>
                    <h3 className="mt-1 text-lg font-medium tracking-[-0.03em] sm:text-xl">{p.nome}</h3>
                    <p className="mt-0.5 text-sm text-maré">{formatarPreco(p.precoCentavos)}</p>
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
                    <a
                      href={linkWhatsApp(p.disponivel ? `Olá! Tenho interesse no produto: ${p.nome}.` : `Olá! O ${p.nome} vai voltar ao estoque?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${botaoConsultar} mt-auto`}
                    >
                      {p.disponivel ? "Consultar" : "Avise-me"}
                    </a>
                  </div>
                </li>
              ))
            : EXEMPLOS.map((p) => (
                <li key={p.nome} className="group flex flex-col rounded-3xl bg-white p-2 sm:p-3">
                  <div className="aspect-square overflow-hidden rounded-2xl">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                      <Foto descricao={p.foto} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-maré">{p.categoria}</p>
                    <h3 className="mt-1 text-lg font-medium tracking-[-0.03em] sm:text-xl">{p.nome}</h3>
                    <p className="mt-0.5 text-sm text-maré">Sob consulta</p>
                    <a href={linkWhatsApp(`Olá! Tenho interesse no produto: ${p.nome}.`)} target="_blank" rel="noopener noreferrer" className={botaoConsultar}>
                      Consultar
                    </a>
                  </div>
                </li>
              ))}
        </ul>

        <div className="mt-10 flex justify-center">
          {/* FALTA: trocar pela página /loja quando existir */}
          <Botao href={ESCOLA.loja} externo variante="mar">
            Ver todos os produtos
          </Botao>
        </div>
      </div>
    </section>
  );
}
