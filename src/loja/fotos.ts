import { ErroLoja } from "./tipos.ts";

export async function prepararFoto(arquivo: File): Promise<Blob> {
  if (!arquivo.type.startsWith("image/")) {
    throw new ErroLoja("dados_invalidos", "Selecione um arquivo de imagem.");
  }
  if (arquivo.size > 15 * 1024 * 1024) {
    throw new ErroLoja("dados_invalidos", "A imagem deve ter no máximo 15 MB.");
  }
  let imagem: ImageBitmap | undefined;
  try {
    imagem = await createImageBitmap(arquivo, { imageOrientation: "from-image" });
    const escala = Math.min(1, 1600 / Math.max(imagem.width, imagem.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(imagem.width * escala));
    canvas.height = Math.max(1, Math.round(imagem.height * escala));
    const contexto = canvas.getContext("2d");
    if (!contexto) throw new Error("Canvas indisponível.");
    contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    const converter = (tipo: string) => new Promise<Blob | null>((resolver) => {
      canvas.toBlob(resolver, tipo, 0.85);
    });
    const webp = await converter("image/webp");
    if (webp?.type === "image/webp") return webp;
    contexto.globalCompositeOperation = "destination-over";
    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    const jpeg = await converter("image/jpeg");
    if (!jpeg || jpeg.type !== "image/jpeg") throw new Error("Conversão indisponível.");
    return jpeg;
  } catch {
    throw new ErroLoja("dados_invalidos", "Não foi possível preparar a imagem. Tente outra foto.");
  } finally {
    imagem?.close();
  }
}
