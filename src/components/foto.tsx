import { Camera } from "lucide-react";

type Props = {
  /** O que a foto precisa mostrar. Vira o alt quando a foto real chegar. */
  descricao: string;
  src?: string;
  className?: string;
  /** Onde fica o aviso: no centro, ou no alto quando há texto por cima da foto */
  aviso?: "centro" | "topo" | "direita";
};

/**
 * Espaço de foto. Sem `src`, mostra um aviso do que falta fotografar, nas
 * cores da marca, para o cliente saber exatamente o que mandar.
 *
 * Quando a foto real chegar: medir a proporção dela e ajustar o card à foto
 * (nunca cortar pessoa nem esticar).
 */
const AVISO = {
  centro: "items-center",
  topo: "items-start pt-10",
  // Hero: alto no celular (o texto fica embaixo), lado direito no desktop
  direita: "items-start pt-10 md:items-center md:justify-end md:pr-[12%] md:pt-0",
};

export default function Foto({ descricao, src, className = "", aviso = "centro" }: Props) {
  if (src) {
    return <img src={src} alt={descricao} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <div
      role="img"
      aria-label={`Espaço para foto: ${descricao}`}
      className={`flex h-full w-full justify-center ${AVISO[aviso]} bg-[linear-gradient(135deg,#CDEEF2_0%,#E7F4EE_55%,#F4EBC0_100%)] ${className}`}
    >
      <div className="flex max-w-[16rem] flex-col items-center gap-2 px-4 text-center text-lagoa-forte/80">
        <Camera aria-hidden className="h-6 w-6" strokeWidth={1.5} />
        <span className="text-[10px] font-medium uppercase tracking-[0.25em]">Foto</span>
        <span className="text-xs font-normal normal-case tracking-normal">{descricao}</span>
      </div>
    </div>
  );
}
