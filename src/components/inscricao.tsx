import { useState, type FormEvent, type ReactNode } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import { useIdioma } from "@/idioma";
import Cabecalho from "./cabecalho";
import { IconeWhatsApp } from "./icones";

/**
 * Formulário para quem quer fazer aula. Sem banco por enquanto: ao enviar,
 * abre o WhatsApp da escola com tudo preenchido, e a pessoa só aperta enviar.
 *
 * As escolhas ficam guardadas pela posição, para não perderem a marcação
 * quando o visitante troca o idioma no meio do preenchimento. Em inglês o
 * telefone aceita número de fora (+ e código do país), sem a máscara do DDD.
 *
 * FALTA: quando a loja for ao Supabase, gravar o pedido também (lista de
 * interessados no painel) antes de abrir o WhatsApp.
 */
const MODALIDADES = {
  pt: ["Aula de kitesurf", "Wingfoil ou kite foil", "Downwind", "Kite Trip"],
  en: ["Kitesurf lesson", "Wingfoil or kite foil", "Downwind", "Kite Trip"],
};
const NIVEIS = {
  pt: ["Nunca velejei", "Já fiz algumas aulas", "Já velejo sozinho"],
  en: ["Never ridden", "Had a few lessons", "I ride on my own"],
};
const PACOTES = {
  pt: ["Ainda não sei", "Aula avulsa (2h)", "Pacote 8 horas", "Pacote 10 horas", "Pacote 12 horas"],
  en: ["Not sure yet", "Single lesson (2h)", "8-hour package", "10-hour package", "12-hour package"],
};

const PASSOS = {
  pt: [
    { titulo: "Conte sobre você", texto: "Nível, data e quantas pessoas. Leva um minuto." },
    { titulo: "A equipe confirma", texto: "Pelo WhatsApp, com o melhor horário de vento para a sua aula." },
    { titulo: "Primeira aula", texto: "Equipamento, instrutor e lycra já inclusos. É só chegar." },
  ],
  en: [
    { titulo: "Tell us about you", texto: "Level, date and group size. Takes a minute." },
    { titulo: "The team confirms", texto: "On WhatsApp, with the best wind time for your lesson." },
    { titulo: "First lesson", texto: "Equipment, instructor and rash guard included. Just show up." },
  ],
};

const campo =
  "block h-12 w-full rounded-2xl bg-bandeja px-4 text-[16px] outline-none placeholder:text-maré/60 focus:ring-2 focus:ring-mar";

function mascararTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

function hoje() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function Escolha({ id, nome, opcoes, valor, aoEscolher }: { id: string; nome: string; opcoes: string[]; valor: number; aoEscolher: (v: number) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{nome}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {opcoes.map((o, i) => (
          <label key={i} className="cursor-pointer">
            <input type="radio" name={id} value={i} checked={valor === i} onChange={() => aoEscolher(i)} className="peer sr-only" />
            <span className="inline-flex min-h-[44px] items-center rounded-full bg-bandeja px-4 text-[14px] transition-colors hover:bg-pilula peer-checked:bg-mar peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-lagoa">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Rotulo({ htmlFor, children, opcional }: { htmlFor: string; children: ReactNode; opcional?: boolean }) {
  const { t } = useIdioma();
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
      {children}
      {opcional && <span className="ml-1.5 font-normal text-maré">{t("(opcional)", "(optional)")}</span>}
    </label>
  );
}

export default function Inscricao() {
  const { idioma, t } = useIdioma();
  const en = idioma === "en";
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [modalidade, setModalidade] = useState(0);
  const [nivel, setNivel] = useState(0);
  const [pacote, setPacote] = useState(0);
  const [data, setData] = useState("");
  const [pessoas, setPessoas] = useState(1);
  const [recado, setRecado] = useState("");
  const [erro, setErro] = useState("");
  const [link, setLink] = useState("");

  function enviar(e: FormEvent) {
    e.preventDefault();
    const digitos = telefone.replace(/\D/g, "");
    if (nome.trim().length < 2) return setErro(t("Diga o seu nome.", "Please tell us your name."));
    if (digitos.length < (en ? 8 : 10)) {
      return setErro(t("Informe o WhatsApp com DDD.", "Please enter your WhatsApp number with country code."));
    }
    setErro("");

    const linhas = [
      t("Olá! Quero fazer aula na TS Kite Center.", "Hi! I'd like to take lessons at TS Kite Center."),
      "",
      `${t("Nome", "Name")}: ${nome.trim()}`,
      `WhatsApp: ${telefone}`,
      `${t("Quero", "Interested in")}: ${MODALIDADES[idioma][modalidade]}`,
      `${t("Experiência", "Experience")}: ${NIVEIS[idioma][nivel]}`,
      ...(modalidade === 0 ? [`${t("Pacote", "Package")}: ${PACOTES[idioma][pacote]}`] : []),
      `${t("Data", "Date")}: ${data ? data.split("-").reverse().join("/") : t("a combinar", "flexible")}`,
      `${t("Pessoas", "People")}: ${pessoas}`,
      ...(recado.trim() ? ["", recado.trim()] : []),
    ];
    const url = linkWhatsApp(linhas.join("\n"));
    setLink(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="reservar" className="py-16 sm:py-24">
      <div className="shell">
        <Cabecalho
          rotulo={t("Reservar aula", "Book a lesson")}
          apoio={t(
            "Preencha em um minuto. A equipe responde pelo WhatsApp para combinar o dia.",
            "Fill it in in a minute. The team replies on WhatsApp to set the day.",
          )}
        >
          {t("Sua primeira aula", "Your first lesson")} <span className="suave">{t("começa aqui", "starts here")}</span>
        </Cabecalho>

        <div className="mx-auto mt-12 max-w-4xl">
          {/* Formulário em destaque, sem bandeja em volta */}
          <div className="rounded-painel bg-white p-5 shadow-[0_24px_60px_-28px_rgba(6,34,43,0.35)] ring-1 ring-black/5 sm:p-10">
            {link ? (
              <div role="status" className="flex h-full flex-col items-start justify-center py-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sol">
                  <Check aria-hidden className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <p className="titulo mt-6 text-3xl">{t("Quase lá", "Almost there")}, {nome.trim().split(" ")[0]}!</p>
                <p className="mt-2 max-w-md leading-relaxed text-maré">
                  {t(
                    "Abrimos o WhatsApp com os seus dados. É só enviar a mensagem por lá e a equipe confirma o dia.",
                    "We opened WhatsApp with your details. Just send the message there and the team will confirm the day.",
                  )}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-white"
                  >
                    <IconeWhatsApp className="h-5 w-5" /> {t("Abrir de novo", "Open again")}
                  </a>
                  <button type="button" onClick={() => setLink("")} className="h-12 rounded-full bg-pilula px-5 font-mono text-[13px] font-medium uppercase tracking-[0.12em]">
                    {t("Editar dados", "Edit details")}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={enviar} noValidate className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Rotulo htmlFor="aluno-nome">{t("Nome", "Name")}</Rotulo>
                    <input id="aluno-nome" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder={t("Como podemos te chamar", "What should we call you")} className={campo} />
                  </div>
                  <div>
                    <Rotulo htmlFor="aluno-whats">WhatsApp</Rotulo>
                    <input
                      id="aluno-whats"
                      type="tel"
                      inputMode="tel"
                      autoComplete={en ? "tel" : "tel-national"}
                      value={telefone}
                      onChange={(e) => setTelefone(en ? e.target.value.replace(/[^\d+()\s-]/g, "").slice(0, 20) : mascararTelefone(e.target.value))}
                      placeholder={t("(85) 99999-9999", "+1 555 123 4567")}
                      className={campo}
                    />
                  </div>
                </div>

                <Escolha id="modalidade" nome={t("O que você quer fazer", "What would you like to do")} opcoes={MODALIDADES[idioma]} valor={modalidade} aoEscolher={setModalidade} />
                <Escolha id="nivel" nome={t("Sua experiência", "Your experience")} opcoes={NIVEIS[idioma]} valor={nivel} aoEscolher={setNivel} />
                {modalidade === 0 && <Escolha id="pacote" nome={t("Pacote", "Package")} opcoes={PACOTES[idioma]} valor={pacote} aoEscolher={setPacote} />}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Rotulo htmlFor="aluno-data" opcional>
                      {t("Quando quer vir", "When do you want to come")}
                    </Rotulo>
                    <input id="aluno-data" type="date" min={hoje()} value={data} onChange={(e) => setData(e.target.value)} className={`${campo} pr-3`} />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium" id="aluno-pessoas">
                      {t("Quantas pessoas", "How many people")}
                    </p>
                    <div role="group" aria-labelledby="aluno-pessoas" className="flex h-12 items-center justify-between rounded-2xl bg-bandeja px-1.5">
                      <button type="button" aria-label={t("Menos uma pessoa", "One less person")} disabled={pessoas <= 1} onClick={() => setPessoas(pessoas - 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white disabled:opacity-40">
                        <Minus aria-hidden className="h-4 w-4" />
                      </button>
                      <span aria-live="polite" className="text-[16px] font-medium">
                        {pessoas} {pessoas === 1 ? t("pessoa", "person") : t("pessoas", "people")}
                      </span>
                      <button type="button" aria-label={t("Mais uma pessoa", "One more person")} disabled={pessoas >= 10} onClick={() => setPessoas(pessoas + 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white disabled:opacity-40">
                        <Plus aria-hidden className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Rotulo htmlFor="aluno-recado" opcional>
                    {t("Algo que a gente precisa saber", "Anything we should know")}
                  </Rotulo>
                  <textarea
                    id="aluno-recado"
                    rows={3}
                    maxLength={500}
                    value={recado}
                    onChange={(e) => setRecado(e.target.value)}
                    placeholder={t("Ex.: horário preferido, se sabe nadar, dúvidas", "E.g. preferred time, whether you can swim, questions")}
                    className="block w-full resize-none rounded-2xl bg-bandeja px-4 py-3 text-[16px] outline-none placeholder:text-maré/60 focus:ring-2 focus:ring-mar"
                  />
                </div>

                {erro && (
                  <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
                    {erro}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="group inline-flex h-12 items-center justify-between gap-3 rounded-full bg-sol pl-5 pr-1.5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-mar transition-transform active:scale-[0.97]">
                    {t("Enviar pelo WhatsApp", "Send via WhatsApp")}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mar text-white">
                      <IconeWhatsApp className="h-4 w-4" />
                    </span>
                  </button>
                  <p className="text-xs text-maré">{t("Seus dados vão só para a equipe da TS.", "Your details go only to the TS team.")}</p>
                </div>
              </form>
            )}
          </div>
          {/* Como funciona: faixa escura embaixo do formulário */}
          <div className="mt-3 rounded-painel bg-mar p-6 text-white sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">{t("Como funciona", "How it works")}</p>
            <ol className="mt-6 grid gap-6 sm:grid-cols-3">
              {PASSOS[idioma].map((p, i) => (
                <li key={p.titulo} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sol font-mono text-sm font-medium text-mar">{i + 1}</span>
                  <div>
                    <p className="font-medium tracking-[-0.01em]">{p.titulo}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/75">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/80">
              {t(
                "Prefere conversar antes? O mesmo WhatsApp tira qualquer dúvida sobre aulas, níveis e equipamento.",
                "Rather talk first? The same WhatsApp answers any question about lessons, levels and equipment.",
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
