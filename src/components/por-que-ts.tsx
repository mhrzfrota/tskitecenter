import { useIdioma } from "@/idioma";

// Dois grupos: o que vem com a aula e o que a base no Outro Beach Club oferece
const ETIQUETAS = {
  pt: [
    { titulo: "Na aula", itens: ["Segurança", "Certificado IKO", "Instrutores qualificados", "Equipamento North", "Plano sob medida"] },
    { titulo: "Na base", itens: ["Espaço kids", "Chuveiros", "Estacionamento", "Gramado para montar"] },
  ],
  en: [
    { titulo: "In the lesson", itens: ["Safety", "IKO certificate", "Qualified instructors", "North equipment", "Tailored plan"] },
    { titulo: "At the base", itens: ["Kids area", "Showers", "Parking", "Lawn to rig your kite"] },
  ],
};

const NUMEROS = (t: <V>(pt: V, en: V) => V): { valor: string; rotulo: string }[] => [
  { valor: t("2.000+", "2,000+"), rotulo: t("Alunos certificados", "Certified students") },
  { valor: "5/5", rotulo: t("Nota no TripAdvisor", "TripAdvisor rating") },
  { valor: "10h", rotulo: t("Curso para iniciante", "Beginner course") },
  { valor: t("Jul–Jan", "Jul–Jan"), rotulo: t("Temporada de vento forte", "Strong wind season") },
];

const IRMAOS = [
  { nome: "Set Teixeira", foto: "/fotos/set.webp" },
  { nome: "Tomás Teixeira", foto: "/fotos/tomas.webp" },
];

/**
 * "Sobre" no tom das histórias da North: seção escura, os retratos grandes
 * com a legenda embaixo, a estrutura numa lista com linhas finas e os
 * números separados por linhas, sem ícone.
 */
export default function PorQueTs() {
  const { idioma, t } = useIdioma();
  return (
    <section id="sobre" className="escuro py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <p className="rotulo">{t("Sobre a TS", "About TS")}</p>
            <h2 className="titulo mt-4 max-w-3xl text-[2.25rem] sm:text-5xl lg:text-[3.6rem]">
              {t("Dois irmãos nascidos no Cumbuco", "Two brothers born in Cumbuco")}{" "}
              <span className="suave">{t("e uma família inteira vivendo o vento", "and a whole family living the wind")}</span>
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-white/85 sm:text-base lg:max-w-sm lg:justify-self-end">
            {t(
              "Set e Tomás Teixeira cresceram na praia, competiram e transformaram a paixão numa das maiores escolas do Cumbuco, com alunos do mundo todo.",
              "Set and Tomás Teixeira grew up on this beach, competed, and turned their passion into one of the biggest schools in Cumbuco, with students from all over the world.",
            )}
          </p>
        </div>

        <div className="mt-14 grid gap-12 sm:mt-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          {/* Retratos em 3:4, a proporção das fotos: nada é cortado */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {IRMAOS.map((irmao) => (
              <figure key={irmao.nome} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-cartao bg-ceu">
                  <img
                    src={irmao.foto}
                    alt={t(`${irmao.nome} na praia do Cumbuco`, `${irmao.nome} on Cumbuco beach`)}
                    width={1200}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">{t("Fundador da TS", "TS founder")}</p>
                  <p className="titulo mt-1.5 text-[1.4rem] sm:text-[1.9rem]">{irmao.nome}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="flex flex-col gap-10">
            {ETIQUETAS[idioma].map((g) => (
              <div key={g.titulo}>
                <p className="rotulo">{g.titulo}</p>
                <ul className="mt-3 divide-y divide-white/20 border-y border-white/20">
                  {g.itens.map((item) => (
                    <li key={item} className="py-3 text-[17px] tracking-[-0.01em]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-sm leading-relaxed text-white/80">
              {t("Desde criança no mar do Cumbuco, onde cresceram e competiram.", "In the Cumbuco sea since childhood, where they grew up and competed.")}
            </p>
          </div>
        </div>

        <ul className="mt-20 grid grid-cols-2 border-t border-white/20 lg:grid-cols-4">
          {NUMEROS(t).map((n, i) => (
            <li
              key={n.rotulo}
              className={`pt-8 lg:pb-2 ${i % 2 ? "pl-5 sm:pl-8" : ""} ${i > 1 ? "mt-8 border-t border-white/20 lg:mt-0 lg:border-t-0" : ""} ${
                i > 0 ? "border-l border-white/20 lg:pl-8" : ""
              } ${i === 2 ? "max-lg:border-l-0" : ""}`}
            >
              <p className="titulo text-4xl sm:text-[3.25rem]">{n.valor}</p>
              <p className="mt-2 text-sm text-white/80">{n.rotulo}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
