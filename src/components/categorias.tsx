import { linkWhatsApp } from "@/marca";
import Foto from "./foto";

type Categoria = {
  antes: string;
  destaque: string;
  texto: string;
  foto: string;
  src?: string;
  botao: string;
  href: string;
  externo?: boolean;
};

/**
 * As frentes do site. Hoje cada card leva ao WhatsApp ou a uma seção desta
 * página; quando existirem páginas próprias (loja, previsão), o link muda aqui.
 */
const CATEGORIAS: Categoria[] = [
  {
    antes: "Aulas de",
    destaque: "kitesurf",
    texto: "Do primeiro velejo ao avançado. Curso de 10h para iniciante.",
    foto: "Instrutor e aluno com o kite na areia",
    botao: "Reservar aula",
    href: linkWhatsApp("Olá! Quero saber sobre as aulas de kitesurf."),
    externo: true,
  },
  {
    antes: "",
    destaque: "Downwind",
    texto: "Lagoinha → Guajiru e Pecém → Taíba, com 4x4 de apoio.",
    foto: "Kiters velejando juntos no mar aberto",
    botao: "Saiba mais",
    href: linkWhatsApp("Olá! Quero saber sobre o downwind."),
    externo: true,
  },
  {
    antes: "Kite",
    destaque: "Trip",
    texto: "Circuito dos Ventos: viagem guiada pelo litoral cearense.",
    foto: "Grupo da Kite Trip em uma praia do Ceará",
    botao: "Saiba mais",
    href: linkWhatsApp("Olá! Quero saber sobre a Kite Trip, o Circuito dos Ventos."),
    externo: true,
  },
  {
    antes: "Wingfoil e",
    destaque: "kite foil",
    texto: "Aulas personalizadas: asa, equilíbrio e transições.",
    foto: "Aluno de wingfoil sobre a água",
    botao: "Saiba mais",
    href: linkWhatsApp("Olá! Quero saber sobre as aulas de wingfoil e kite foil."),
    externo: true,
  },
  {
    antes: "Loja",
    destaque: "TS Kite Shop",
    texto: "Kites, pranchas e acessórios. Parceria North Kiteboarding.",
    foto: "Vitrine da loja com kites e pranchas",
    botao: "Ver produtos",
    href: "#loja",
  },
  {
    antes: "Previsão de",
    destaque: "vento",
    texto: "Veja como está o vento no Cumbuco antes de sair de casa.",
    foto: "Kites no céu do Cumbuco com vento forte",
    botao: "Ver o vento",
    href: "#vento",
  },
];

export default function Categorias() {
  return (
    <section id="categorias" className="py-16 sm:py-24">
      <div className="shell">
        <h2 className="titulo-secao text-center">
          Tudo o que a <strong>TS</strong> oferece
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center leading-relaxed tracking-normal text-maré">
          Escola, viagem, foil e loja no mesmo lugar, na Praia do Cumbuco.
        </p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {CATEGORIAS.map((c) => (
            <li key={c.destaque} className="group relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
                <Foto aviso="topo" descricao={c.foto} src={c.src} />
              </div>
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,34,43,0)_35%,rgba(6,34,43,0.7)_70%,rgba(6,34,43,0.9)_100%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-9 text-center text-white">
                <h3 className="text-lg uppercase tracking-[0.25em]">
                  {c.antes && <span className="font-light">{c.antes} </span>}
                  <strong className="font-display font-extrabold italic text-sol">{c.destaque}</strong>
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed tracking-normal text-white/85">{c.texto}</p>
                <a
                  href={c.href}
                  {...(c.externo && { target: "_blank", rel: "noopener noreferrer" })}
                  className="btn-claro mt-6"
                >
                  {c.botao}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
