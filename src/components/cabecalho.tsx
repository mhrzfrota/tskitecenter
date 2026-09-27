import type { ReactNode } from "react";

/** Abertura de seção da referência: rótulo em mono, título com parte apagada, apoio curto. */
export default function Cabecalho({ rotulo, children, apoio }: { rotulo: string; children: ReactNode; apoio?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="rotulo">{rotulo}</p>
      <h2 className="titulo mt-5 text-[2.1rem] sm:text-5xl">{children}</h2>
      {apoio && <p className="mx-auto mt-5 max-w-lg leading-relaxed text-maré">{apoio}</p>}
    </div>
  );
}
