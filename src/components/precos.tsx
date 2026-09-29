import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Award, Banknote, CreditCard, Info, Package, QrCode, Shirt, UserRound } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import Botao from "./botao";
import Cabecalho from "./cabecalho";

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

const AULAS = [
  { nome: "Aula avulsa", resumo: "Para experimentar", ...AVULSA },
  { nome: "Pacote 8 horas", resumo: "Quatro aulas de 2 horas", horas: 8, preco: 2500 },
  { nome: "Pacote 10 horas", resumo: "Cinco aulas de 2 horas", horas: 10, preco: 3000 },
  { nome: "Pacote 12 horas", resumo: "Seis aulas de 2 horas", horas: 12, preco: 3500 },
];
const MAX_HORAS = 12;
const MENOR_POR_HORA = Math.min(...AULAS.map((a) => a.preco / a.horas));

const INCLUSO: { icone: LucideIcon; nome: string; explica: string }[] = [
  { icone: Package, nome: "Equipamento completo", explica: "Kite, prancha e acessórios da escola" },
  { icone: UserRound, nome: "Instrutor particular", explica: "A aula é só sua, sem dividir" },
  { icone: Award, nome: "Certificado IKO", explica: "Reconhecido por escolas do mundo todo" },
  { icone: Shirt, nome: "Lycra UV", explica: "Protege do sol enquanto você veleja" },
];

const PAGAMENTO: { icone: LucideIcon; forma: string; detalhe: string; desconto: number }[] = [
  { icone: CreditCard, forma: "Crédito em 2x ou débito", detalhe: "Valor da tabela", desconto: 0 },
  { icone: QrCode, forma: "Pix", detalhe: "5% de desconto", desconto: 0.05 },
  { icone: Banknote, forma: "Dinheiro", detalhe: "10% de desconto", desconto: 0.1 },
];

const PARA_QUEM_VELEJA = [
  {
    nome: "Aluguel de equipamento completo",
    explica: "Kite com barra, prancha, trapézio e colete. Equipamentos novos, modelos 2027.",
    preco: 250,
    unidade: "por hora",
    aviso: "Só é permitido velejar em frente à escola.",
  },
  {
    nome: "Suporte de downwind",
    explica: "Downwind é velejar de uma praia a outra a favor do vento. O instrutor vai com você na água.",
    preco: 300,
    unidade: "por hora",
  },
  {
    nome: "Transfer Cumbuco ↔ Cauípe",
    explica: "Levamos você até a lagoa do Cauípe e trazemos de volta.",
    preco: 200,
    unidade: "ida e volta",
  },
];

const ACESSORIOS = [
  { nome: "Prancha", explica: "Onde você fica em pé", preco: 120 },
  { nome: "Trapézio", explica: "Cinto que prende você ao kite", preco: 80 },
  { nome: "Colete", explica: "Flutuação e proteção", preco: 50 },
  { nome: "Leash", explica: "Cordinha de segurança", preco: 50 },
];

const reais = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
    maximumFractionDigits: 2,
  });

const rotuloMini = "font-mono text-[11px] uppercase tracking-[0.12em]";

/** Régua de horas: um tracinho por hora, de 0 a 12, preenchido até o pacote. */
function ReguaHoras({ horas, escuro }: { horas: number; escuro: boolean }) {
  return (
    <div aria-hidden className="mt-5 flex gap-1">
      {Array.from({ length: MAX_HORAS }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < horas ? "bg-sol" : escuro ? "bg-white/15" : "bg-bandeja"}`}
        />
      ))}
    </div>
  );
}

function CardAula({ aula }: { aula: (typeof AULAS)[number] }) {
  const porHora = aula.preco / aula.horas;
  const destaque = porHora === MENOR_POR_HORA;
  const economia = POR_HORA_AVULSA * aula.horas - aula.preco;
  return (
    <li className={`flex flex-col rounded-3xl p-5 sm:p-6 ${destaque ? "bg-mar text-white" : "bg-white"}`}>
      {/* Os outros cards reservam a mesma altura, para os preços ficarem na mesma linha */}
      <span
        aria-hidden={!destaque}
        className={`mb-4 self-start rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${
          destaque ? "bg-sol text-mar" : "invisible max-sm:hidden"
        }`}
      >
        Menor valor por hora
      </span>
      <p className={`${rotuloMini} ${destaque ? "text-white/70" : "text-maré"}`}>{aula.nome}</p>
      <p className="mt-1 text-sm">{aula.resumo}</p>

      <ReguaHoras horas={aula.horas} escuro={destaque} />
      <p className={`mt-2 text-xs ${destaque ? "text-white/70" : "text-maré"}`}>{aula.horas} horas de aula</p>

      <p className="titulo mt-5 text-[2.2rem] sm:text-[2.5rem]">{reais(aula.preco)}</p>
      <p className={`text-sm ${destaque ? "text-white/80" : "text-maré"}`}>{reais(porHora)} por hora</p>

      {/* Só aparece quando existe economia de verdade (o pacote contra aulas avulsas) */}
      <p className={`mt-3 min-h-[1.5rem] text-sm font-medium ${destaque ? "text-sol" : "text-lagoa-forte"}`}>
        {economia > 0 ? `Economia de ${reais(economia)}` : ""}
      </p>

      <dl
        className={`mt-4 space-y-1.5 border-t pt-4 text-sm ${destaque ? "border-white/15 text-white/80" : "border-bandeja text-maré"}`}
      >
        <div className="flex justify-between gap-2">
          <dt>No Pix</dt>
          <dd className={`font-medium ${destaque ? "text-white" : "text-mar"}`}>{reais(aula.preco * 0.95)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Em dinheiro</dt>
          <dd className={`font-medium ${destaque ? "text-white" : "text-mar"}`}>{reais(aula.preco * 0.9)}</dd>
        </div>
      </dl>

      <a
        href={linkWhatsApp(`Olá! Quero reservar: ${aula.nome.toLowerCase()} (${aula.horas} horas, ${reais(aula.preco)}).`)}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 inline-flex h-11 items-center justify-center rounded-full font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
          destaque ? "bg-sol text-mar hover:bg-[#EDD35B]" : "bg-pilula text-mar hover:bg-[#D8E2E2]"
        }`}
      >
        Reservar
      </a>
    </li>
  );
}

function QueroAprender() {
  return (
    <>
      <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {AULAS.map((a) => (
          <CardAula key={a.nome} aula={a} />
        ))}
      </ul>

      <div className="mt-2 grid gap-2 sm:mt-3 sm:gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-white p-5 sm:p-6">
          <p className={`${rotuloMini} text-maré`}>Incluso em todas as aulas</p>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {INCLUSO.map(({ icone: Icone, nome, explica }) => (
              <li key={nome} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sol">
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

        <div className="rounded-3xl bg-white p-5 sm:p-6">
          <p className={`${rotuloMini} text-maré`}>Formas de pagamento</p>
          <ul className="mt-3 divide-y divide-bandeja">
            {PAGAMENTO.map(({ icone: Icone, forma, detalhe, desconto }) => (
              <li key={forma} className="flex items-center gap-3 py-3">
                <Icone aria-hidden className="h-5 w-5 shrink-0 text-maré" strokeWidth={1.75} />
                <span className="flex-1 text-[15px]">{forma}</span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    desconto ? "bg-lagoa-forte/10 text-lagoa-forte" : "text-maré"
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
  return (
    <div className="grid gap-2 sm:gap-3 lg:grid-cols-[1.5fr_1fr]">
      <ul className="grid gap-2 sm:gap-3">
        {PARA_QUEM_VELEJA.map((s) => (
          <li key={s.nome} className="rounded-3xl bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-medium tracking-[-0.02em]">{s.nome}</p>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-maré">{s.explica}</p>
              </div>
              <p className="shrink-0 text-right">
                <span className="titulo block text-[1.7rem]">{reais(s.preco)}</span>
                <span className="text-xs text-maré">{s.unidade}</span>
              </p>
            </div>
            {s.aviso && (
              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-sol/20 px-4 py-3 text-sm">
                <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                {s.aviso}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="flex flex-col rounded-3xl bg-white p-5 sm:p-6">
        <p className={`${rotuloMini} text-maré`}>Aluguel de acessórios</p>
        <p className="mt-1 text-sm text-maré">Valores por diária</p>
        <ul className="mt-3 divide-y divide-bandeja">
          {ACESSORIOS.map((a) => (
            <li key={a.nome} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-[15px] font-medium">{a.nome}</p>
                <p className="text-xs text-maré">{a.explica}</p>
              </div>
              <span className="shrink-0 text-[17px] font-medium">{reais(a.preco)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <Botao
            href={linkWhatsApp("Olá! Quero saber sobre aluguel de equipamento e disponibilidade.")}
            externo
            variante="mar"
          >
            Consultar
          </Botao>
        </div>
      </div>
    </div>
  );
}

const ABAS = [
  { id: "aprender", rotulo: "Quero aprender" },
  { id: "velejo", rotulo: "Já velejo" },
] as const;

export default function Precos() {
  const [aba, setAba] = useState<(typeof ABAS)[number]["id"]>("aprender");

  return (
    <section id="precos" className="py-20 sm:py-28">
      <div className="shell">
        <Cabecalho rotulo="Preços" apoio="Aulas individuais, com o equipamento e o instrutor só para você.">
          Aulas com tudo incluso <span className="suave">do primeiro bordo ao certificado</span>
        </Cabecalho>

        {/* Dois caminhos: quem nunca velejou não precisa ver preço de leash */}
        <div className="mt-10 flex justify-center">
          <div role="tablist" aria-label="Tipo de preço" className="inline-flex rounded-full bg-bandeja p-1">
            {ABAS.map((a) => (
              <button
                key={a.id}
                id={`aba-${a.id}`}
                type="button"
                role="tab"
                aria-selected={aba === a.id}
                aria-controls={`painel-${a.id}`}
                onClick={() => setAba(a.id)}
                className={`h-11 rounded-full px-5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors sm:px-7 ${
                  aba === a.id ? "bg-mar text-white" : "text-maré hover:text-mar"
                }`}
              >
                {a.rotulo}
              </button>
            ))}
          </div>
        </div>

        <div
          id={`painel-${aba}`}
          role="tabpanel"
          aria-labelledby={`aba-${aba}`}
          className="mx-auto mt-6 max-w-6xl rounded-painel bg-bandeja p-2 sm:p-3"
        >
          {aba === "aprender" ? <QueroAprender /> : <JaVelejo />}
        </div>
      </div>
    </section>
  );
}
