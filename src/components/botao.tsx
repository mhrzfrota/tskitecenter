import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Props = {
  href: string;
  children: ReactNode;
  /** sol: ação principal · mar: escuro sobre fundo claro · cinza: discreto no claro · vidro: discreto no escuro */
  variante?: "sol" | "mar" | "cinza" | "vidro";
  externo?: boolean;
  className?: string;
};

const ESTILO = {
  sol: "bg-sol text-mar hover:bg-[#EDD35B]",
  mar: "bg-mar text-white hover:bg-mar-2",
  cinza: "text-mar ring-1 ring-inset ring-mar/20 hover:bg-mar/5",
  vidro: "bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur-md hover:bg-white/20",
};

/** Botão em pílula, no tom contido da North: texto normal e uma seta que anda no hover. */
export default function Botao({ href, children, variante = "sol", externo, className = "" }: Props) {
  const seta = variante === "sol" || variante === "mar";
  return (
    <a
      href={href}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
      className={`group inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[15px] font-semibold tracking-[-0.01em] transition-colors active:scale-[0.98] ${ESTILO[variante]} ${className}`}
    >
      {children}
      {seta && <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </a>
  );
}
