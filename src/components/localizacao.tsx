import { ESCOLA, linkWhatsApp } from "@/marca";
import Foto from "./foto";

const BUSCA_MAPA = encodeURIComponent("Outro Beach Club, Av. Des. Jurema, 56, Cumbuco, Caucaia - CE");

export default function Localizacao() {
  return (
    <section id="localizacao" className="bg-espuma py-16 sm:py-24">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Localização</p>
          <h2 className="titulo-secao mt-4">
            Estamos no <strong>Outro Beach Club</strong>
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed tracking-normal text-maré">
            Nossa base fica na beira da Praia do Cumbuco, com gramado para montar o kite, estacionamento,
            chuveiros e espaço para a família passar o dia.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-[10px]">Endereço</p>
              <p className="mt-2 leading-relaxed tracking-normal">
                Av. Des. Jurema, 56
                <br />
                Praia do Cumbuco, Caucaia (CE)
              </p>
            </div>
            <div>
              <p className="eyebrow text-[10px]">Temporada</p>
              <p className="mt-2 leading-relaxed tracking-normal">Vento forte de julho a janeiro</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={`https://www.google.com/maps?q=${BUSCA_MAPA}`} target="_blank" rel="noopener noreferrer" className="btn-primario">
              Abrir no mapa
            </a>
            <a href={linkWhatsApp("Olá! Vim pelo site da TS Kite Center.")} target="_blank" rel="noopener noreferrer" className="btn-contorno">
              Falar com a equipe
            </a>
          </div>
        </div>

        <div className="bg-white shadow-[0_24px_48px_-24px_rgba(6,34,43,0.3)]">
          <div className="grid grid-cols-[1fr_0.6fr]">
            <iframe
              src={`https://www.google.com/maps?q=${BUSCA_MAPA}&output=embed`}
              title={`Mapa: ${ESCOLA.nome} no Outro Beach Club`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/5] h-full w-full border-0"
            />
            <div className="hidden sm:block">
              <Foto descricao="Fachada ou gramado do Outro Beach Club" />
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.3em]">TS Kite Center</p>
            <p className="mt-1 text-sm tracking-normal text-maré">Outro Beach Club · Cumbuco, Caucaia (CE)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
