import type { LucideIcon } from "lucide-react";
import { GraduationCap, Map, Sailboat, ShoppingBag, Wind } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import { useIdioma } from "@/idioma";
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
 * cima e quatro em grade. A previsão não entra aqui: tem seção própria logo
 * abaixo. Quando existirem páginas
 * próprias (loja, previsão), o link muda aqui.
 */
const CATEGORIAS = (t: <T>(pt: T, en: T) => T): Categoria[] => [
  {
    icone: GraduationCap,
    nome: t("Aulas de kitesurf", "Kitesurf lessons"),
    texto: t(
      "Do primeiro velejo ao avançado. A gente avalia você antes e monta o plano. Iniciante faz o curso de 10h.",
      "From your first ride to advanced. We assess you first and build the plan. Beginners take the 10-hour course.",
    ),
    foto: t("Instrutor e aluno com o kite na areia", "Instructor and student with the kite on the sand"),
    botao: t("Reservar aula", "Book a lesson"),
    href: "#reservar",
    largo: true,
  },
  {
    icone: Wind,
    nome: "Downwind",
    texto: t(
      "Lagoinha → Guajiru e Pecém → Taíba, com 4x4 de apoio, resgate e suporte na água e em terra.",
      "Lagoinha → Guajiru and Pecém → Taíba, with a 4x4 support car, rescue and backup on the water and on land.",
    ),
    foto: t("Kiters velejando juntos no mar aberto", "Kiters riding together on the open sea"),
    botao: t("Saiba mais", "Learn more"),
    href: linkWhatsApp(t("Olá! Quero saber sobre o downwind.", "Hi! I'd like to know about the downwind.")),
    externo: true,
  },
  {
    icone: Map,
    nome: "Kite Trip",
    texto: t(
      "Circuito dos Ventos: viagem guiada pelo litoral cearense, velejando de spot em spot.",
      "Circuito dos Ventos: a guided trip along the Ceará coast, riding from spot to spot.",
    ),
    foto: t("Grupo da Kite Trip em uma praia do Ceará", "Kite Trip group on a beach in Ceará"),
    botao: t("Saiba mais", "Learn more"),
    href: linkWhatsApp(t("Olá! Quero saber sobre a Kite Trip, o Circuito dos Ventos.", "Hi! I'd like to know about the Kite Trip (Circuito dos Ventos).")),
    externo: true,
  },
  {
    icone: Sailboat,
    nome: t("Wingfoil e kite foil", "Wingfoil and kite foil"),
    texto: t(
      "Aulas personalizadas de controle da asa, equilíbrio e transições.",
      "Personalized lessons on wing control, balance and transitions.",
    ),
    foto: t("Aluno de wingfoil sobre a água", "Wingfoil student on the water"),
    botao: t("Saiba mais", "Learn more"),
    href: linkWhatsApp(t("Olá! Quero saber sobre as aulas de wingfoil e kite foil.", "Hi! I'd like to know about wingfoil and kite foil lessons.")),
    externo: true,
  },
  {
    icone: ShoppingBag,
    nome: "TS Kite Shop",
    texto: t(
      "Kites, pranchas e acessórios com a parceria North Kiteboarding, e quem entende para indicar.",
      "Kites, boards and accessories through our North Kiteboarding partnership, with experts to advise you.",
    ),
    foto: t("Vitrine da loja com kites e pranchas", "Shop display with kites and boards"),
    botao: t("Ver produtos", "See products"),
    href: "#loja",
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
      <div className="mt-auto aspect-[2/1] overflow-hidden rounded-2xl">
        <Foto descricao={c.foto} src={c.src} />
      </div>
    </li>
  );
}

export default function Categorias() {
  const { t } = useIdioma();
  return (
    <section id="servicos" className="py-16 sm:py-24">
      <div className="shell">
        <Cabecalho
          rotulo={t("Serviços", "Services")}
          apoio={t("Escola, viagem, foil e loja no mesmo lugar, na Praia do Cumbuco.", "School, trips, foil and shop in one place, on Cumbuco Beach.")}
        >
          {t("Tudo o que a TS oferece", "Everything TS offers")} <span className="suave">{t("dentro e fora da água", "on and off the water")}</span>
        </Cabecalho>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 md:grid-cols-2">
          {CATEGORIAS(t).map((c) => (
            <Card key={c.nome} c={c} />
          ))}
        </ul>
      </div>
    </section>
  );
}
