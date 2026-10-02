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
};

/**
 * As frentes do site, lado a lado: no desktop os cinco numa fileira dentro da
 * bandeja; no celular e no tablet, rolando para o lado, para a seção não
 * esticar a página. A previsão não entra aqui: tem seção própria. Quando existirem páginas
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
  return (
    <li className="flex w-[78%] shrink-0 snap-start flex-col rounded-3xl bg-white p-2 sm:w-[44%] sm:p-3 lg:w-auto">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Foto descricao={c.foto} src={c.src} />
        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sol">
          <Icone aria-hidden className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
      </div>
      <div className="flex flex-1 flex-col items-start px-2 pb-2 pt-4 sm:px-3 sm:pb-3">
        <h3 className="titulo text-[1.4rem]">{c.nome}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-maré">{c.texto}</p>
        <div className="mt-auto pt-5">
          <Botao href={c.href} externo={c.externo} variante="cinza" className="!h-10 !px-4 !text-[12px]">
            {c.botao}
          </Botao>
        </div>
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

        {/* Cards lado a lado: no desktop numa fileira só; no celular e tablet, rolando para o lado */}
        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto bg-bandeja px-5 py-3 sm:-mx-8 sm:scroll-px-8 sm:gap-3 sm:px-8 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible lg:rounded-painel lg:bg-bandeja lg:p-3">
          {CATEGORIAS(t).map((c) => (
            <Card key={c.nome} c={c} />
          ))}
        </ul>
      </div>
    </section>
  );
}
