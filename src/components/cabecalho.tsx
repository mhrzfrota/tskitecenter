import type { ReactNode } from "react";

/**
 * Abertura de seção no formato da North: título à esquerda, apoio e ação à
 * direita, na mesma linha de base. No celular, um embaixo do outro.
 */
export default function Cabecalho({ rotulo, children, apoio, acao }: { rotulo: string; children: ReactNode; apoio?: string; acao?: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
      <div>
        <p className="rotulo">{rotulo}</p>
        <h2 className="titulo mt-4 max-w-3xl text-[2.25rem] sm:text-5xl lg:text-[3.6rem]">{children}</h2>
      </div>
      {(apoio || acao) && (
        <div className="flex flex-col items-start gap-6 lg:max-w-sm lg:justify-self-end">
          {apoio && <p className="text-[15px] leading-relaxed opacity-80 sm:text-base">{apoio}</p>}
          {acao}
        </div>
      )}
    </div>
  );
}
