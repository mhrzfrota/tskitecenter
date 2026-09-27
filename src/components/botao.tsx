import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  children: ReactNode;
  variante?: "sol" | "mar" | "cinza";
  externo?: boolean;
  className?: string;
};

const ESTILO = {
  sol: { base: "bg-sol text-mar", circulo: "bg-mar text-white" },
  mar: { base: "bg-mar text-sol", circulo: "bg-sol text-mar" },
  cinza: { base: "bg-pilula text-mar hover:bg-[#D8E2E2]", circulo: "" },
};

/** Botão em pílula da referência: texto em mono e, nos principais, a seta num círculo. */
export default function Botao({ href, children, variante = "sol", externo, className = "" }: Props) {
  const e = ESTILO[variante];
  const comSeta = variante !== "cinza";
  return (
    <a
      href={href}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
      className={`group inline-flex h-12 items-center gap-3 rounded-full font-mono text-[13px] font-medium uppercase tracking-[0.12em] transition-transform active:scale-[0.97] ${
        comSeta ? "pl-5 pr-1.5" : "px-5"
      } ${e.base} ${className}`}
    >
      {children}
      {comSeta && (
        <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${e.circulo}`}>
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </span>
      )}
    </a>
  );
}
