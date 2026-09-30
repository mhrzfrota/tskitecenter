import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { loja } from "@/loja";

/**
 * Foto guardada no navegador (IndexedDB). A imagem entra inteira
 * (object-contain sobre branco): produto nunca é cortado.
 */
export default function FotoLoja({ id, alt, className = "" }: { id?: string; alt: string; className?: string }) {
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

  return (
    <div className={`flex items-center justify-center bg-white ${className}`}>
      {url ? (
        <img src={url} alt={alt} className="h-full w-full object-contain" />
      ) : (
        <ImageIcon aria-hidden className="h-1/4 w-1/4 text-mar/20" strokeWidth={1.25} />
      )}
    </div>
  );
}
