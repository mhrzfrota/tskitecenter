import type { LucideIcon } from "lucide-react";
import { GraduationCap, Map, Sailboat, ShoppingBag, Wind, Waves } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import Botao from "./botao";
import Cabecalho from "./cabecalho";
import Foto from "./foto";

type Categoria = {
  icone: LucideIcon;
  nome: string;
  texto: string;
  foto: string;
  src?: string;
  botao: string;
  href: string;
  externo?: boolean;
  largo?: boolean;
};

/**
 * As frentes do site, na bandeja de cards da referência: um card largo em
 * cima, quatro em grade, outro largo embaixo. Quando existirem páginas
 * próprias (loja, previsão), o link muda aqui.
 */
const CATEGORIAS: Categoria[] = [
  {
    icone: GraduationCap,
    nome: "Aulas de kitesurf",
    texto: "Do primeiro velejo ao avançado. A gente avalia você antes e monta o plano. Iniciante faz o curso de 10h.",
    foto: "Instrutor e aluno com o kite na areia",
    botao: "Reservar aula",
    href: linkWhatsApp("Olá! Quero saber sobre as aulas de kitesurf."),
    externo: true,
    largo: true,
  },
  {
    icone: Wind,
    nome: "Downwind",
    texto: "Lagoinha → Guajiru e Pecém → Taíba, com 4x4 de apoio, resgate e suporte na água e em terra.",
    foto: "Kiters velejando juntos no mar aberto",
    botao: "Saiba mais",
    href: linkWhatsApp("Olá! Quero saber sobre o downwind."),
    externo: true,
  },
  {
    icone: Map,
    nome: "Kite Trip",
    texto: "Circuito dos Ventos: viagem guiada pelo litoral cearense, velejando de spot em spot.",
    foto: "Grupo da Kite Trip em uma praia do Ceará",
    botao: "Saiba mais",
    href: linkWhatsApp("Olá! Quero saber sobre a Kite Trip, o Circuito dos Ventos."),
    externo: true,
  },
  {
    icone: Sailboat,
    nome: "Wingfoil e kite foil",
    texto: "Aulas personalizadas de controle da asa, equilíbrio e transições.",
    foto: "Aluno de wingfoil sobre a água",
    botao: "Saiba mais",
    href: linkWhatsApp("Olá! Quero saber sobre as aulas de wingfoil e kite foil."),
    externo: true,
  },
  {
    icone: Waves,
    nome: "Previsão de vento",
    texto: "Veja como está o vento no Cumbuco agora, antes de sair de casa.",
    foto: "Kites no céu do Cumbuco com vento forte",
    botao: "Ver o vento",
    href: "#vento",
  },
  {
    icone: ShoppingBag,
    nome: "TS Kite Shop",
    texto: "Kites, pranchas e acessórios com a parceria North Kiteboarding, e quem entende para indicar.",
    foto: "Vitrine da loja com kites e pranchas",
    botao: "Ver produtos",
    href: "#loja",
    largo: true,
  },
];

function Card({ c }: { c: Categoria }) {
  const Icone = c.icone;
  const texto = (
    <div className="flex flex-col items-start">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sol">
        <Icone aria-hidden className="h-5 w-5" strokeWidth={2} />
      </span>
      <h3 className="titulo mt-6 text-[1.75rem] sm:text-[2rem]">{c.nome}</h3>
      <p className="mt-2 max-w-md leading-relaxed text-maré">{c.texto}</p>
      <Botao href={c.href} externo={c.externo} variante="cinza" className="mt-7">
        {c.botao}
      </Botao>
    </div>
  );

  if (c.largo) {
    return (
      <li className="grid gap-6 rounded-3xl bg-white p-5 sm:p-6 md:col-span-2 md:grid-cols-2 md:items-center md:gap-10">
        <div className="md:py-4 md:pl-2">{texto}</div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl">
          <Foto descricao={c.foto} src={c.src} />
        </div>
      </li>
    );
  }
  return (
    <li className="flex flex-col gap-8 rounded-3xl bg-white p-5 sm:p-6">
      {texto}
      <div className="mt-auto aspect-[16/10] overflow-hidden rounded-2xl">
        <Foto descricao={c.foto} src={c.src} />
      </div>
    </li>
  );
}

export default function Categorias() {
  return (
    <section id="servicos" className="py-20 sm:py-28">
      <div className="shell">
        <Cabecalho rotulo="Serviços" apoio="Escola, viagem, foil e loja no mesmo lugar, na Praia do Cumbuco.">
          Tudo o que a TS oferece <span className="suave">dentro e fora da água</span>
        </Cabecalho>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 md:grid-cols-2">
          {CATEGORIAS.map((c) => (
            <Card key={c.nome} c={c} />
          ))}
        </ul>
      </div>
    </section>
  );
}
