import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Award, Banknote, CreditCard, Info, Package, PiggyBank, QrCode, Shirt, Star, UserRound } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import Botao from "./botao";
import Cabecalho from "./cabecalho";
import { useIdioma } from "@/idioma";

type T = <V>(pt: V, en: V) => V;

/**
 * Tabela de preços enviada pela escola em 2026-09-29.
 *
 * Pensada para quem nunca fez kite: dois caminhos ("quero aprender" e "já
 * velejo"), cada termo técnico explicado numa linha, e as contas já feitas
 * (valor por hora, preço no Pix e no dinheiro, economia sobre a aula avulsa).
 * Nada aqui é estimado: tudo sai dos valores da tabela.
 */
const AVULSA = { horas: 2, preco: 650 };
const POR_HORA_AVULSA = AVULSA.preco / AVULSA.horas;

const AULAS = (t: T) => [
  { nome: t("Aula avulsa", "Single lesson"), resumo: t("Para experimentar", "To try it out"), ...AVULSA },
  { nome: t("Pacote 8 horas", "8-hour package"), resumo: t("Quatro aulas de 2 horas", "Four 2-hour lessons"), horas: 8, preco: 2500 },
  { nome: t("Pacote 10 horas", "10-hour package"), resumo: t("Cinco aulas de 2 horas", "Five 2-hour lessons"), horas: 10, preco: 3000 },
  { nome: t("Pacote 12 horas", "12-hour package"), resumo: t("Seis aulas de 2 horas", "Six 2-hour lessons"), horas: 12, preco: 3500 },
];
type Aula = ReturnType<typeof AULAS>[number];
const MAX_HORAS = 12;
const MENOR_POR_HORA = Math.min(...AULAS((pt) => pt).map((a) => a.preco / a.horas));

const INCLUSO = (t: T): { icone: LucideIcon; nome: string; explica: string }[] => [
  { icone: Package, nome: t("Equipamento completo", "Full equipment"), explica: t("Kite, prancha e acessórios da escola", "The school's kite, board and accessories") },
  { icone: UserRound, nome: t("Instrutor particular", "Private instructor"), explica: t("A aula é só sua, sem dividir", "The lesson is all yours, no sharing") },
  { icone: Award, nome: t("Certificado IKO", "IKO certificate"), explica: t("Reconhecido por escolas do mundo todo", "Recognized by schools worldwide") },
  { icone: Shirt, nome: t("Lycra UV", "UV rash guard"), explica: t("Protege do sol enquanto você veleja", "Sun protection while you ride") },
];

const PAGAMENTO = (t: T): { icone: LucideIcon; forma: string; detalhe: string; desconto: number }[] => [
  { icone: CreditCard, forma: t("Crédito em 2x ou débito", "Credit (2 installments) or debit"), detalhe: t("Valor da tabela", "List price"), desconto: 0 },
  { icone: QrCode, forma: "Pix", detalhe: t("5% de desconto", "5% off"), desconto: 0.05 },
  { icone: Banknote, forma: t("Dinheiro", "Cash"), detalhe: t("10% de desconto", "10% off"), desconto: 0.1 },
];

const PARA_QUEM_VELEJA = (t: T): { nome: string; explica: string; preco: number; unidade: string; aviso?: string }[] => [
  {
    nome: t("Aluguel de equipamento completo", "Full equipment rental"),
    explica: t(
      "Kite com barra, prancha, trapézio e colete. Equipamentos novos, modelos 2027.",
      "Kite with bar, board, harness and vest. New gear, 2027 models.",
    ),
    preco: 250,
    unidade: t("por hora", "per hour"),
    aviso: t("Só é permitido velejar em frente à escola.", "Riding is only allowed in front of the school."),
  },
  {
    nome: t("Suporte de downwind", "Downwind support"),
    explica: t(
      "Downwind é velejar de uma praia a outra a favor do vento. O instrutor vai com você na água.",
      "Downwind means riding from one beach to another with the wind. The instructor rides with you.",
    ),
    preco: 300,
    unidade: t("por hora", "per hour"),
  },
  {
    nome: "Transfer Cumbuco ↔ Cauípe",
    explica: t("Levamos você até a lagoa do Cauípe e trazemos de volta.", "We take you to the Cauípe lagoon and bring you back."),
    preco: 200,
    unidade: t("ida e volta", "round trip"),
  },
];

const ACESSORIOS = (t: T) => [
  { nome: t("Prancha", "Board"), explica: t("Onde você fica em pé", "What you stand on"), preco: 120 },
  { nome: t("Trapézio", "Harness"), explica: t("Cinto que prende você ao kite", "Belt that connects you to the kite"), preco: 80 },
  { nome: t("Colete", "Vest"), explica: t("Flutuação e proteção", "Flotation and protection"), preco: 50 },
  { nome: "Leash", explica: t("Cordinha de segurança", "Safety line"), preco: 50 },
];

/** Sempre em reais; em inglês só muda a pontuação (R$3,500). */
const reais = (valor: number, idioma: "pt" | "en" = "pt") =>
  valor.toLocaleString(idioma === "en" ? "en-US" : "pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
    maximumFractionDigits: 2,
  });

const rotuloMini = "text-[11px] font-semibold uppercase tracking-[0.16em]";

/** Régua de horas: um tracinho por hora, de 0 a 12, preenchido até o pacote. */
function ReguaHoras({ horas, escuro }: { horas: number; escuro: boolean }) {
  return (
    <div aria-hidden className="flex gap-1">
      {Array.from({ length: MAX_HORAS }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < horas ? "bg-sol" : escuro ? "bg-white/20" : "bg-mar/10"}`}
        />
      ))}
    </div>
  );
}

/**
 * Card no padrão das páginas de planos de empresas grandes: nome, preço grande,
 * valor por hora em pílula, economia, botão cheio e os detalhes embaixo. O de
 * menor valor por hora vem no escuro com contorno e selo do sol, para saltar.
 */
function CardAula({ aula }: { aula: Aula }) {
  const { idioma, t } = useIdioma();
  const brl = (v: number) => reais(v, idioma);
  const porHora = aula.preco / aula.horas;
  const destaque = porHora === MENOR_POR_HORA;
  const economia = POR_HORA_AVULSA * aula.horas - aula.preco;
  const apoio = destaque ? "text-white/75" : "text-maré";
  return (
    <li
      className={`relative flex flex-col rounded-cartao p-6 sm:p-7 ${
        destaque
          ? "bg-abismo text-white shadow-[0_28px_56px_-24px_rgba(3,22,28,0.6)] ring-2 ring-sol"
          : "bg-white shadow-[0_1px_2px_rgba(6,34,43,0.06)] ring-1 ring-inset ring-mar/10"
      }`}
    >
      {destaque && (
        <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-sol px-4 py-1.5 text-[12px] font-bold text-mar shadow-[0_6px_16px_-6px_rgba(3,22,28,0.45)]">
          <Star aria-hidden className="h-3.5 w-3.5 fill-current" />
          {t("Menor valor por hora", "Best value per hour")}
        </span>
      )}

      <p className="text-[19px] font-semibold tracking-[-0.02em]">{aula.nome}</p>
      <p className={`mt-1 text-sm ${apoio}`}>{aula.resumo}</p>

      <div className="mt-5">
        <ReguaHoras horas={aula.horas} escuro={destaque} />
        <p className={`mt-2 text-xs font-medium ${apoio}`}>{aula.horas} {t("horas de aula", "hours of lessons")}</p>
      </div>

      <p className="titulo mt-6 text-[2.75rem] leading-none sm:text-[3rem]">{brl(aula.preco)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${destaque ? "bg-sol text-mar" : "bg-nevoa text-mar"}`}>
          {brl(porHora)} / {t("hora", "hour")}
        </span>
      </div>
      {/* Só aparece quando existe economia de verdade (o pacote contra aulas avulsas); a avulsa reserva a altura */}
      <p className={`mt-3 flex min-h-[1.5rem] items-center gap-1.5 text-sm font-semibold ${destaque ? "text-sol" : "text-lagoa-forte"}`}>
        {economia > 0 ? (
          <>
            <PiggyBank aria-hidden className="h-4 w-4" strokeWidth={2} />
            {t(`Economize ${brl(economia)}`, `Save ${brl(economia)}`)}
          </>
        ) : (
          <span className={`font-medium ${apoio}`}>{t("Para conhecer o esporte", "A first taste of the sport")}</span>
        )}
      </p>

      <a
        href={linkWhatsApp(
          t(
            `Olá! Quero reservar: ${aula.nome.toLowerCase()} (${aula.horas} horas, ${brl(aula.preco)}).`,
            `Hi! I'd like to book: ${aula.nome.toLowerCase()} (${aula.horas} hours, ${brl(aula.preco)}).`,
          ),
        )}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-colors ${
          destaque ? "bg-sol text-mar hover:bg-[#EDD35B]" : "bg-mar text-white hover:bg-mar-2"
        }`}
      >
        {t("Reservar", "Book")}
        <ArrowRight aria-hidden className="h-4 w-4" />
      </a>

      <dl className={`mt-6 space-y-2.5 border-t pt-5 text-sm ${destaque ? "border-white/15" : "border-mar/10"}`}>
        <div className="flex items-center justify-between gap-2">
          <dt className={`flex items-center gap-2 ${apoio}`}>
            <QrCode aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            {t("No Pix", "With Pix")} <span className="text-xs">(−5%)</span>
          </dt>
          <dd className="font-semibold">{brl(aula.preco * 0.95)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className={`flex items-center gap-2 ${apoio}`}>
            <Banknote aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            {t("Em dinheiro", "In cash")} <span className="text-xs">(−10%)</span>
          </dt>
          <dd className="font-semibold">{brl(aula.preco * 0.9)}</dd>
        </div>
      </dl>
    </li>
  );
}

function QueroAprender() {
  const { t } = useIdioma();
  return (
    <>
      {/* pt reserva o espaço do selo que sobe acima do card em destaque */}
      <ul className="grid gap-x-4 gap-y-8 pt-4 sm:grid-cols-2 xl:grid-cols-4">
        {AULAS(t).map((a) => (
          <CardAula key={a.nome} aula={a} />
        ))}
      </ul>

      <div className="mt-6 grid gap-3 sm:gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-cartao bg-white p-5 ring-1 ring-inset ring-mar/10 sm:p-6">
          <p className={`${rotuloMini} text-maré`}>{t("Incluso em todas as aulas", "Included in every lesson")}</p>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {INCLUSO(t).map(({ icone: Icone, nome, explica }) => (
              <li key={nome} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nevoa">
                  <Icone aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-medium tracking-[-0.01em]">{nome}</p>
                  <p className="text-sm text-maré">{explica}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-cartao bg-white p-5 ring-1 ring-inset ring-mar/10 sm:p-6">
          <p className={`${rotuloMini} text-maré`}>{t("Formas de pagamento", "Payment options")}</p>
          <ul className="mt-3 divide-y divide-mar/10">
            {PAGAMENTO(t).map(({ icone: Icone, forma, detalhe, desconto }) => (
              <li key={forma} className="flex items-center gap-3 py-3">
                <Icone aria-hidden className="h-5 w-5 shrink-0 text-maré" strokeWidth={1.75} />
                <span className="flex-1 text-[15px]">{forma}</span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    desconto ? "bg-lagoa-forte/10 text-lagoa-forte" : "bg-nevoa text-maré"
                  }`}
                >
                  {detalhe}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function JaVelejo() {
  const { idioma, t } = useIdioma();
  const brl = (v: number) => reais(v, idioma);
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.5fr_1fr]">
      <ul className="grid gap-3 sm:gap-4">
        {PARA_QUEM_VELEJA(t).map((s) => (
          <li key={s.nome} className="rounded-cartao bg-white p-6 shadow-[0_1px_2px_rgba(6,34,43,0.06)] ring-1 ring-inset ring-mar/10 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[19px] font-semibold tracking-[-0.02em]">{s.nome}</p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-maré">{s.explica}</p>
              </div>
              <div className="flex shrink-0 items-end justify-between gap-4 sm:flex-col sm:items-end">
                <p className="sm:text-right">
                  <span className="titulo block text-[2.25rem] leading-none">{brl(s.preco)}</span>
                  <span className="mt-2 inline-block rounded-full bg-nevoa px-3 py-1 text-[13px] font-semibold text-mar">{s.unidade}</span>
                </p>
                <a
                  href={linkWhatsApp(t(`Olá! Quero saber sobre: ${s.nome} (${brl(s.preco)}, ${s.unidade}).`, `Hi! I'd like to know about: ${s.nome} (${brl(s.preco)}, ${s.unidade}).`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-mar px-5 text-[14px] font-semibold text-white transition-colors hover:bg-mar-2"
                >
                  {t("Reservar", "Book")}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </div>
            </div>
            {s.aviso && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-sol/20 px-4 py-3 text-sm">
                <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                {s.aviso}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="flex flex-col rounded-cartao bg-white p-6 shadow-[0_1px_2px_rgba(6,34,43,0.06)] ring-1 ring-inset ring-mar/10 sm:p-7">
        <p className={`${rotuloMini} text-maré`}>{t("Aluguel de acessórios", "Accessory rental")}</p>
        <p className="mt-1 text-sm text-maré">{t("Valores por diária", "Prices per day")}</p>
        <ul className="mt-3 divide-y divide-mar/10">
          {ACESSORIOS(t).map((a) => (
            <li key={a.nome} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-[15px] font-medium">{a.nome}</p>
                <p className="text-xs text-maré">{a.explica}</p>
              </div>
              <span className="shrink-0 text-[19px] font-semibold tracking-[-0.02em]">{brl(a.preco)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <Botao
            href={linkWhatsApp(t("Olá! Quero saber sobre aluguel de equipamento e disponibilidade.", "Hi! I'd like to know about equipment rental and availability."))}
            externo
            variante="mar"
          >
            {t("Consultar", "Ask us")}
          </Botao>
        </div>
      </div>
    </div>
  );
}

const ABAS = [
  { id: "aprender", pt: "Quero aprender", en: "I want to learn" },
  { id: "velejo", pt: "Já velejo", en: "I already ride" },
] as const;

export default function Precos() {
  const { t } = useIdioma();
  const [aba, setAba] = useState<(typeof ABAS)[number]["id"]>("aprender");

  return (
    <section id="precos" className="py-20 sm:py-28">
      <div className="shell">
        <Cabecalho
          rotulo={t("Preços", "Prices")}
          apoio={t("Aulas individuais, com o equipamento e o instrutor só para você.", "Private lessons, with the equipment and the instructor just for you.")}
        >
          {t("Aulas com tudo incluso", "All-inclusive lessons")}{" "}
          <span className="suave">{t("do primeiro bordo ao certificado", "from your first ride to your certificate")}</span>
        </Cabecalho>

        {/* Dois caminhos: quem nunca velejou não precisa ver preço de leash */}
        <div className="mt-12 flex">
          <div role="tablist" aria-label={t("Tipo de preço", "Price type")} className="inline-flex rounded-full p-1 ring-1 ring-inset ring-mar/15">
            {ABAS.map((a) => (
              <button
                key={a.id}
                id={`aba-${a.id}`}
                type="button"
                role="tab"
                aria-selected={aba === a.id}
                aria-controls={`painel-${a.id}`}
                onClick={() => setAba(a.id)}
                className={`h-11 rounded-full px-5 text-[14px] font-semibold transition-colors sm:px-7 ${
                  aba === a.id ? "bg-mar text-white" : "text-maré hover:text-mar"
                }`}
              >
                {t(a.pt, a.en)}
              </button>
            ))}
          </div>
        </div>

        <div
          id={`painel-${aba}`}
          role="tabpanel"
          aria-labelledby={`aba-${aba}`}
          className="mt-6"
        >
          {aba === "aprender" ? <QueroAprender /> : <JaVelejo />}
        </div>
      </div>
    </section>
  );
}
