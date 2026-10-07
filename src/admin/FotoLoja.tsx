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

  // Foto tirada com cenário (grama, plantas): aparece inteira, com o próprio contorno
  // arredondado e respiro em volta, para ficar claro que nada foi cortado
  if (url && id && fotoComCenario(id)) {
    const extra = imgClassName.replace(/(^|\s)(p-\S+|mix-blend-multiply)(?=\s|$)/g, " ");
    return (
      <div className={`flex items-center justify-center p-[7%] ${fundo} ${className}`}>
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-auto max-h-full w-auto max-w-full rounded-xl object-contain shadow-[0_10px_24px_-14px_rgba(6,34,43,0.45)] ${extra}`}
        />
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
