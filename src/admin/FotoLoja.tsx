import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { fotoComCenario, loja } from "@/loja";

/**
 * Foto guardada no navegador (IndexedDB). A imagem entra inteira
 * (object-contain sobre branco): produto nunca é cortado.
 * `fundo` e `imgClassName` deixam a vitrine trocar o fundo e o respiro.
 */
export default function FotoLoja({
  id,
  alt,
  className = "",
  fundo = "bg-white",
  imgClassName = "",
}: {
  id?: string;
  alt: string;
  className?: string;
  fundo?: string;
  imgClassName?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    const carregar = () => {
      if (!id) return setUrl(null);
      loja.urlDaFoto(id).then((u) => vivo && setUrl(u)).catch(() => vivo && setUrl(null));
    };
    carregar();
    const cancelar = loja.ouvir(carregar);
    return () => {
      vivo = false;
      cancelar();
    };
  }, [id]);

  // Foto tirada com cenário: inteira, sem o respiro de produto recortado, sobre ela mesma desfocada
  if (url && id && fotoComCenario(id)) {
    return (
      <div className={`relative isolate flex items-center justify-center overflow-hidden ${fundo} ${className}`}>
        <img src={url} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full scale-125 object-cover opacity-70 blur-2xl" />
        <img src={url} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-contain ${imgClassName.replace(/\bp-\[[^\]]+\]|\bmix-blend-multiply\b/g, "")}`} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${fundo} ${className}`}>
      {url ? (
        <img src={url} alt={alt} className={`h-full w-full object-contain ${imgClassName}`} />
      ) : (
        <ImageIcon aria-hidden className="h-1/4 w-1/4 text-mar/20" strokeWidth={1.25} />
      )}
    </div>
  );
}
