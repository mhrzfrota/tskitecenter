import { loja } from "./index.ts";

// TESTE: cadastra produtos de exemplo uma única vez, se a loja estiver vazia.
// Pode ser editado ou removido no painel; não volta depois de removido.
// Remover este arquivo (e as chamadas em main.tsx) quando a loja for ao Supabase.
const CHAVE = "ts:loja:teste-1";

export async function semearTeste(): Promise<void> {
  try {
    if (localStorage.getItem(CHAVE)) return;
    localStorage.setItem(CHAVE, "sim");
  } catch {
    return;
  }
  try {
    if ((await loja.listar({ incluirInativos: true })).length > 0) return;
    const resposta = await fetch("/produtos/prod1.jpg");
    if (!resposta.ok) throw new Error("Foto de teste indisponível.");
    const foto = await loja.guardarFoto(await resposta.blob());
    await loja.salvar({
      nome: "Duotone Fin Box Carbon 30 FS 5.0",
      categoria: "acessorios",
      descricao: "",
      precoCentavos: 55000,
      opcoes: [],
      fotos: [foto],
      disponivel: true,
      destaque: true,
      ativo: true,
    });
  } catch {
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      // tenta de novo na próxima visita
    }
  }
}

// TESTE 2: dois cards sem foto, para ver a vitrine com mais itens.
const CHAVE_2 = "ts:loja:teste-2";

const SEM_FOTO = [
  { nome: "North Reach", categoria: "kites", precoCentavos: 899000, opcoes: ["7m", "9m", "12m"] },
  { nome: "Lycra TS Manga Longa", categoria: "vestuario", precoCentavos: null, opcoes: ["P", "M", "G", "GG"] },
] as const;

export async function semearTeste2(): Promise<void> {
  try {
    if (localStorage.getItem(CHAVE_2)) return;
    localStorage.setItem(CHAVE_2, "sim");
  } catch {
    return;
  }
  try {
    const nomes = new Set((await loja.listar({ incluirInativos: true })).map((p) => p.nome));
    for (const produto of SEM_FOTO) {
      if (nomes.has(produto.nome)) continue;
      await loja.salvar({
        ...produto,
        opcoes: [...produto.opcoes],
        descricao: "",
        fotos: [],
        disponivel: true,
        destaque: false,
        ativo: true,
      });
    }
  } catch {
    try {
      localStorage.removeItem(CHAVE_2);
    } catch {
      // tenta de novo na próxima visita
    }
  }
}
