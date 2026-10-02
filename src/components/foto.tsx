import { Camera } from "lucide-react";
import { useIdioma } from "@/idioma";

type Props = {
  /** O que a foto precisa mostrar. Vira o alt quando a foto real chegar. */
  descricao: string;
  src?: string;
  className?: string;
  /** `ceu` para os painéis grandes com texto branco por cima */
  tom?: "claro" | "ceu";
  /** Onde fica o aviso do que fotografar */
  aviso?: "centro" | "baixo" | "canto" | "nenhum";
};

/**
 * Espaço de foto. Sem `src`, mostra o que falta fotografar, para o cliente
 * saber exatamente o que mandar.
 *
 * Quando a foto real chegar: medir a proporção dela e ajustar o card à foto
 * (nunca cortar pessoa nem esticar).
 */
const AVISO = {
  centro: "items-center",
  baixo: "items-end pb-[18%]",
  // Painéis com texto e card por cima: o aviso vai para o canto de baixo
  canto: "items-end justify-end p-4 [&>div]:items-end [&>div]:text-right",
  // Hero: o texto do aviso competia com o título; fica só o céu
  nenhum: "items-center [&>div]:hidden",
};

export default function Foto({ descricao, src, className = "", tom = "claro", aviso = "centro" }: Props) {
  const { t } = useIdioma();
  if (src) {
    return <img src={src} alt={descricao} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }
  const ceu = tom === "ceu";
  return (
    <div
      role="img"
      aria-label={`${t("Espaço para foto", "Photo placeholder")}: ${descricao}`}
      className={`flex h-full w-full justify-center ${AVISO[aviso]} ${
        ceu ? "bg-ceu text-white/75" : "bg-[linear-gradient(135deg,#DDF1F4_0%,#EEF5F1_55%,#F6EFCB_100%)] text-lagoa-forte/80"
      } ${className}`}
    >
      <div className="flex max-w-[15rem] flex-col items-center gap-1.5 px-4 text-center">
        <Camera aria-hidden className="h-5 w-5" strokeWidth={1.5} />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]">{t("Foto", "Photo")}</span>
        <span className="text-xs">{descricao}</span>
      </div>
    </div>
  );
}
