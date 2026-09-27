import { ESCOLA, linkWhatsApp } from "@/marca";
import Foto from "./foto";

type Produto = { categoria: string; nome: string; preco?: string; foto: string; src?: string };

/**
 * Vitrine da loja: duas fileiras de três.
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
    <section id="loja" className="bg-espuma py-16 sm:py-24">
      <div className="shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">TS Kite Shop</p>
            <h2 className="titulo-secao mt-4">
              Equipamentos <strong>da loja</strong>
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed tracking-normal text-maré">
            Equipamento de ponta, com a parceria North Kiteboarding e quem entende do assunto para indicar.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {PRODUTOS.map((p) => (
            <li key={p.nome} className="group flex flex-col">
              <div className="aspect-square overflow-hidden bg-white">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                  <Foto descricao={p.foto} src={p.src} />
                </div>
              </div>
              <p className="eyebrow mt-4 text-[10px]">{p.categoria}</p>
              <h3 className="mt-1.5 text-base font-normal tracking-normal sm:text-lg">{p.nome}</h3>
              <p className="mt-1 text-sm font-medium tracking-normal text-lagoa-forte">{p.preco ?? "Sob consulta"}</p>
              <a
                href={linkWhatsApp(`Olá! Tenho interesse no produto: ${p.nome}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 self-start border-b border-mar/40 pb-0.5 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:border-lagoa-forte hover:text-lagoa-forte"
              >
                Consultar
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center">
          {/* FALTA: trocar pela página /loja quando existir */}
          <a href={ESCOLA.loja} target="_blank" rel="noopener noreferrer" className="btn-primario">
            Ver todos os produtos
          </a>
        </div>
      </div>
    </section>
  );
}
