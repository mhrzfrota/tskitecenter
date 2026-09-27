import { linkWhatsApp } from "@/marca";
import Botao from "./botao";
import Foto from "./foto";

const BUSCA_MAPA = encodeURIComponent("Outro Beach Club, Av. Des. Jurema, 56, Cumbuco, Caucaia - CE");

/** Painel de chamada da referência: foto de fundo arredondada, texto à esquerda e um card flutuando à direita. */
export default function Localizacao() {
  return (
    <section id="localizacao" className="p-2 sm:p-3">
      <div className="relative isolate overflow-hidden rounded-painel">
        <div className="absolute inset-0 -z-10">
          <Foto tom="ceu" aviso="canto" descricao="Outro Beach Club visto da praia" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,34,43,0.45)_0%,rgba(6,34,43,0.1)_60%)]" />

        <div className="shell grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="text-white">
            <p className="rotulo">Onde estamos</p>
            <h2 className="titulo mt-5 text-[2.1rem] sm:text-5xl">
              No Outro Beach Club, <span className="suave">na beira da praia</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/90">
              Gramado para montar o kite, estacionamento, chuveiros e espaço para a família passar o dia.
              Av. Des. Jurema, 56, Praia do Cumbuco, Caucaia (CE).
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Botao href={`https://www.google.com/maps?q=${BUSCA_MAPA}`} externo>
                Abrir no mapa
              </Botao>
              <a
                href={linkWhatsApp("Olá! Vim pelo site da TS Kite Center.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full bg-white/20 px-5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                Falar com a equipe
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-2 shadow-[0_30px_60px_-24px_rgba(6,34,43,0.5)] sm:p-3">
            <iframe
              src={`https://www.google.com/maps?q=${BUSCA_MAPA}&output=embed`}
              title="Mapa: TS Kite Center no Outro Beach Club"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-2xl border-0 bg-bandeja"
            />
            <div className="flex items-center justify-between px-3 pb-2 pt-4">
              <div>
                <p className="font-medium tracking-[-0.02em]">TS Kite Center</p>
                <p className="text-sm text-maré">Cumbuco, Caucaia (CE)</p>
              </div>
              <span className="rounded-full bg-bandeja px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em]">Jul–Jan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
