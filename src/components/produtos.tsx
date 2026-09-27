import { ESCOLA, linkWhatsApp } from "@/marca";
import Botao from "./botao";
import Cabecalho from "./cabecalho";
import Foto from "./foto";

type Produto = { categoria: string; nome: string; preco?: string; foto: string; src?: string };

/**
 * Vitrine da loja: duas fileiras de três, na bandeja cinza.
 *
 * FALTA: produtos reais, fotos e preços da @tskiteshop_cumbuco. Os itens
 * abaixo são só a estrutura, com as categorias típicas de uma loja de kite.
 * Sem preço, o card mostra "Sob consulta" e o botão vai para o WhatsApp.
 */
const PRODUTOS: Produto[] = [
  { categoria: "Kites", nome: "Kite", foto: "Kite aberto na areia, fundo limpo" },
  { categoria: "Pranchas", nome: "Prancha twin tip", foto: "Prancha twin tip em pé, fundo limpo" },
  { categoria: "Barras", nome: "Barra de controle", foto: "Barra de controle com linhas" },
  { categoria: "Trapézios", nome: "Trapézio", foto: "Trapézio de kite" },
  { categoria: "Foil", nome: "Wing", foto: "Asa de wingfoil inflada" },
  { categoria: "Vestuário", nome: "Lycra TS", foto: "Lycra com a marca TS" },
];

export default function Produtos() {
  return (
    <section id="loja" className="py-20 sm:py-28">
      <div className="shell">
        <Cabecalho rotulo="TS Kite Shop" apoio="Parceria North Kiteboarding, com quem veleja todo dia para indicar o equipamento certo.">
          Equipamento de ponta <span className="suave">para a sua sessão</span>
        </Cabecalho>

        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 lg:grid-cols-3">
          {PRODUTOS.map((p) => (
            <li key={p.nome} className="group flex flex-col rounded-3xl bg-white p-2 sm:p-3">
              <div className="aspect-square overflow-hidden rounded-2xl">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                  <Foto descricao={p.foto} src={p.src} />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-maré">{p.categoria}</p>
                <h3 className="mt-1 text-lg font-medium tracking-[-0.03em] sm:text-xl">{p.nome}</h3>
                <p className="mt-0.5 text-sm text-maré">{p.preco ?? "Sob consulta"}</p>
                <a
                  href={linkWhatsApp(`Olá! Tenho interesse no produto: ${p.nome}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center self-start rounded-full bg-pilula px-4 font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#D8E2E2]"
                >
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
