import type { LucideIcon } from "lucide-react";
import { Clock, Star, Users, Wind } from "lucide-react";
import { useIdioma } from "@/idioma";
import Foto from "./foto";

const ETIQUETAS = {
  pt: [
    ["Segurança", "Certificado IKO", "Instrutores qualificados", "Equipamento North", "Plano sob medida"],
    ["Espaço kids", "Chuveiros", "Estacionamento", "Gramado para montar"],
  ],
  en: [
    ["Safety", "IKO certificate", "Qualified instructors", "North equipment", "Tailored plan"],
    ["Kids area", "Showers", "Parking", "Lawn to rig your kite"],
  ],
};

const NUMEROS = (t: <V>(pt: V, en: V) => V): { icone: LucideIcon; valor: string; rotulo: string }[] => [
  { icone: Users, valor: t("2.000+", "2,000+"), rotulo: t("Alunos certificados", "Certified students") },
  { icone: Star, valor: "5/5", rotulo: t("Nota no TripAdvisor", "TripAdvisor rating") },
  { icone: Clock, valor: "10h", rotulo: t("Curso para iniciante", "Beginner course") },
  { icone: Wind, valor: t("Jul–Jan", "Jul–Jan"), rotulo: t("Temporada de vento forte", "Strong wind season") },
];

/** Uma fileira de etiquetas correndo (duplicada para o laço não ter emenda). */
function Faixa({ itens, inverso }: { itens: string[]; inverso?: boolean }) {
  const lista = [...itens, ...itens];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <ul className="correr flex w-max gap-2" style={inverso ? { animationDirection: "reverse" } : undefined}>
        {lista.map((t, i) => (
          <li key={i} aria-hidden={i >= itens.length} className="whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[13px]">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "Sobre" no formato da referência: título grande com um ícone no meio da
 * frase, dois cards (etiquetas + foto) e a fileira de números.
 * FALTA: certificação dos instrutores (IKO?).
 */
export default function PorQueTs() {
  const { idioma, t } = useIdioma();
  return (
    <section id="sobre" className="bg-white py-16 sm:py-24">
      <div className="shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="rotulo">{t("Sobre a TS", "About TS")}</p>
          <h2 className="titulo mt-5 text-[2.1rem] sm:text-5xl sm:leading-[1.2]">
            {t("Dois irmãos nascidos no Cumbuco", "Two brothers born in Cumbuco")}{" "}
            <span className="mx-1 inline-flex h-10 w-10 translate-y-[-0.1em] items-center justify-center rounded-full bg-marca align-middle sm:h-12 sm:w-12">
              <Wind aria-hidden className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </span>{" "}
            <span className="suave">{t("e uma família inteira vivendo o vento", "and a whole family living the wind")}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-maré">
            {t(
              "Set e Tomás Teixeira cresceram na praia, competiram e transformaram a paixão numa das maiores escolas do Cumbuco, com alunos do mundo todo.",
              "Set and Tomás Teixeira grew up on this beach, competed, and turned their passion into one of the biggest schools in Cumbuco, with students from all over the world.",
            )}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-bandeja py-5">
            <div className="space-y-2">
              <Faixa key={`a-${idioma}`} itens={ETIQUETAS[idioma][0]} />
              <Faixa key={`b-${idioma}`} itens={ETIQUETAS[idioma][1]} inverso />
            </div>
            <div className="px-5">
              <p className="text-sm">{t("O que você encontra aqui", "What you will find here")}</p>
              <p className="titulo mt-1 text-4xl">{t("Estrutura completa", "Full facilities")}</p>
            </div>
          </div>

          <div className="relative isolate aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-auto sm:min-h-[260px]">
            <div className="absolute inset-0 -z-10">
              <Foto tom="ceu" descricao={t("Set e Tomás Teixeira na praia do Cumbuco", "Set and Tomás Teixeira on Cumbuco beach")} />
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,43,0)_40%,rgba(6,34,43,0.75)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="titulo text-4xl">{t("Desde criança", "Since childhood")}</p>
              <p className="mt-1 text-sm text-white/90">{t("no mar do Cumbuco, onde Set e Tomás cresceram e competiram.", "in the Cumbuco sea, where Set and Tomás grew up and competed.")}</p>
            </div>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {NUMEROS(t).map(({ icone: Icone, ...n }) => (
            <li key={n.rotulo} className="flex flex-col items-center text-center">
              <p className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mar">
                  <Icone aria-hidden className="h-4 w-4 text-sol" strokeWidth={2} />
                </span>
                <span className="titulo text-4xl sm:text-5xl">{n.valor}</span>
              </p>
              <p className="mt-2 text-sm text-maré">{n.rotulo}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
