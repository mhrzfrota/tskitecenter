import { ErroLoja } from "./tipos.ts";
import type { Produto } from "./tipos.ts";
import type { RepositorioLoja } from "./repositorio.ts";
import { validarProduto } from "./validacao.ts";

type Foto = { id: string; blob: Blob; tipo: string };
type FotoBackup = { id: string; tipo: string; base64: string };
type Backup = { versao: 1; produtos: Produto[]; fotos: FotoBackup[] };

const ouvintes = new Set<() => void>();
const urls = new Map<string, string>();
let banco: Promise<IDBDatabase> | undefined;
let canal: BroadcastChannel | undefined;
let revisao = 0;

function erroArmazenamento(erro: unknown): ErroLoja {
  if (erro instanceof ErroLoja) return erro;
  return new ErroLoja("armazenamento", "Não foi possível salvar neste navegador. "
    + "Verifique o espaço disponível e se o armazenamento está permitido. Tente novamente.");
}

function notificar(fotos: string[] | null): void {
  revisao += 1;
  for (const [id, url] of urls) {
    if (fotos === null || fotos.includes(id)) {
      URL.revokeObjectURL(url);
      urls.delete(id);
    }
  }
  for (const ouvinte of ouvintes) {
    try {
      ouvinte();
    } catch {
      // Uma tela com erro não deve impedir a atualização das outras.
    }
  }
}

function conectarCanal(): void {
  if (canal || typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;
  try {
    canal = new BroadcastChannel("ts-loja");
    canal.onmessage = (evento: MessageEvent<unknown>) => {
      const dados = evento.data as { evento?: unknown; fotos?: unknown } | null;
      if (!dados || dados.evento !== "mudanca") return;
      if (dados.fotos === null || (Array.isArray(dados.fotos)
        && dados.fotos.every((id) => typeof id === "string"))) {
        notificar(dados.fotos);
      }
    };
  } catch {
    // IndexedDB continua disponível quando o navegador bloqueia o canal.
  }
}

function avisar(fotos: string[] | null = []): void {
  notificar(fotos);
  try {
    canal?.postMessage({ evento: "mudanca", fotos });
  } catch {
    // A gravação já foi confirmada, mesmo se o canal estiver indisponível.
  }
}

function abrir(): Promise<IDBDatabase> {
  conectarCanal();
  if (!banco) {
    banco = new Promise<IDBDatabase>((resolver, rejeitar) => {
      const pedido = indexedDB.open("ts-loja", 1);
      pedido.onupgradeneeded = () => {
        const conexao = pedido.result;
        conexao.createObjectStore("produtos", { keyPath: "id" });
        conexao.createObjectStore("fotos", { keyPath: "id" });
      };
      let bloqueado = false;
      pedido.onblocked = () => {
        bloqueado = true;
        rejeitar(new ErroLoja("armazenamento", "Não foi possível salvar neste navegador. "
          + "Feche as outras abas da loja e tente novamente."));
      };
      pedido.onerror = () => rejeitar(pedido.error);
      pedido.onsuccess = () => {
        const conexao = pedido.result;
        if (bloqueado) {
          conexao.close();
          return;
        }
        conexao.onversionchange = () => {
          conexao.close();
          banco = undefined;
        };
        conexao.onclose = () => {
          banco = undefined;
        };
        resolver(conexao);
      };
    }).catch((erro: unknown) => {
      banco = undefined;
      throw erroArmazenamento(erro);
    });
  }
  return banco;
}

function pedir<T>(pedido: IDBRequest<T>): Promise<T> {
  return new Promise((resolver, rejeitar) => {
    pedido.onsuccess = () => resolver(pedido.result);
    pedido.onerror = () => rejeitar(pedido.error);
  });
}

async function transacionar<T>(
  modo: IDBTransactionMode,
  executar: (transacao: IDBTransaction) => Promise<T>,
): Promise<T> {
  try {
    const conexao = await abrir();
    const transacao = conexao.transaction(["produtos", "fotos"], modo);
    const fim = new Promise<void>((resolver, rejeitar) => {
      transacao.oncomplete = () => resolver();
      transacao.onabort = () => rejeitar(transacao.error ?? new Error("Transação cancelada."));
      transacao.onerror = () => rejeitar(transacao.error);
    });
    // Instala o tratamento antes das requisições para evitar rejeições sem observador.
    void fim.catch(() => undefined);
    try {
      const resultado = await executar(transacao);
      await fim;
      return resultado;
    } catch (erro) {
      try {
        transacao.abort();
      } catch {
        // A transação pode já ter sido cancelada pelo navegador.
      }
      await fim.catch(() => undefined);
      throw erro;
    }
  } catch (erro) {
    throw erroArmazenamento(erro);
  }
}

/** Produtos gravados antes de cores e detalhes existirem chegam sem esses campos. */
function completar(produto: Produto): Produto {
  return { ...produto, cores: produto.cores ?? [], detalhes: produto.detalhes ?? [] };
}

function ordenar(produtos: Produto[]): Produto[] {
  return produtos.sort((a, b) => a.ordem - b.ordem || a.nome.localeCompare(b.nome, "pt-BR")
    || a.id.localeCompare(b.id));
}

function naoEncontrado(): never {
  throw new ErroLoja("nao_encontrado", "Produto não encontrado.");
}

function backupInvalido(): never {
  throw new ErroLoja("dados_invalidos", "O backup da loja é inválido ou está incompleto.");
}

function objeto(valor: unknown): Record<string, unknown> {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) backupInvalido();
  return valor as Record<string, unknown>;
}

function dataValida(valor: unknown): valor is string {
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}T/.test(valor)
    && Number.isFinite(Date.parse(valor)) && new Date(valor).toISOString() === valor;
}

async function lerBackup(arquivo: Blob): Promise<{ produtos: Produto[]; fotos: Foto[] }> {
  let dados: Record<string, unknown>;
  try {
    dados = objeto(JSON.parse(await arquivo.text()));
  } catch {
    backupInvalido();
  }
  if (dados.versao !== 1 || !Array.isArray(dados.produtos) || !Array.isArray(dados.fotos)) backupInvalido();
  const idsFotos = new Set<string>();
  const fotos = dados.fotos.map((valor: unknown): Foto => {
    const foto = objeto(valor);
    if (typeof foto.id !== "string" || !foto.id.trim() || foto.id !== foto.id.trim()
      || idsFotos.has(foto.id) || typeof foto.tipo !== "string" || !/^image\/[\w.+-]+$/.test(foto.tipo)
      || typeof foto.base64 !== "string" || !foto.base64
      || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(foto.base64)) {
      backupInvalido();
    }
    let bytes: Uint8Array<ArrayBuffer>;
    try {
      const binario = atob(foto.base64);
      if (btoa(binario) !== foto.base64) backupInvalido();
      bytes = Uint8Array.from(binario, (caractere) => caractere.charCodeAt(0));
    } catch {
      backupInvalido();
    }
    idsFotos.add(foto.id);
    return { id: foto.id, tipo: foto.tipo, blob: new Blob([bytes], { type: foto.tipo }) };
  });
  const idsProdutos = new Set<string>();
  const produtos = dados.produtos.map((valor: unknown): Produto => {
    const produto = objeto(valor);
    const limpo = validarProduto(produto as unknown as Produto);
    if (!limpo.id || idsProdutos.has(limpo.id) || !Number.isSafeInteger(produto.ordem)
      || (produto.ordem as number) < 0 || !dataValida(produto.criadoEm) || !dataValida(produto.atualizadoEm)
      || produto.atualizadoEm < produto.criadoEm || limpo.fotos.some((id) => !idsFotos.has(id))) {
      backupInvalido();
    }
    idsProdutos.add(limpo.id);
    return {
      ...limpo,
      cores: limpo.cores ?? [],
      detalhes: limpo.detalhes ?? [],
      id: limpo.id,
      ordem: produto.ordem as number,
      criadoEm: produto.criadoEm,
      atualizadoEm: produto.atualizadoEm,
    };
  });
  return { produtos, fotos };
}

async function paraBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const partes: string[] = [];
  for (let inicio = 0; inicio < bytes.length; inicio += 8192) {
    partes.push(String.fromCharCode(...bytes.subarray(inicio, inicio + 8192)));
  }
  return btoa(partes.join(""));
}

export const lojaLocal: RepositorioLoja = {
  async listar(filtro = {}) {
    const produtos = await transacionar("readonly", (transacao) =>
      pedir<Produto[]>(transacao.objectStore("produtos").getAll()));
    return ordenar(produtos.map(completar).filter((produto) => (filtro.incluirInativos || produto.ativo)
      && (!filtro.categoria || produto.categoria === filtro.categoria)
      && (!filtro.somenteDestaques || produto.destaque)));
  },

  async obter(id) {
    return transacionar("readonly", async (transacao) =>
    {
      const produto = await pedir<Produto | undefined>(transacao.objectStore("produtos").get(id));
      return produto ? completar(produto) : null;
    });
  },

  async salvar(entrada) {
    const limpo = validarProduto(entrada);
    const produto = await transacionar("readwrite", async (transacao) => {
      const produtos = transacao.objectStore("produtos");
      const existentes = await pedir<Produto[]>(produtos.getAll());
      const anterior = limpo.id ? existentes.find((item) => item.id === limpo.id) : undefined;
      if (limpo.id && !anterior) naoEncontrado();
      for (const id of limpo.fotos) {
        if (!await pedir(transacao.objectStore("fotos").getKey(id))) {
          throw new ErroLoja("dados_invalidos", "Uma das fotos não foi encontrada. Adicione a foto novamente.");
        }
      }
      const agora = new Date().toISOString();
      const ordem = anterior?.ordem ?? existentes.reduce((maior, item) => Math.max(maior, item.ordem), -1) + 1;
      if (!Number.isSafeInteger(ordem)) {
        throw new ErroLoja("dados_invalidos", "Não foi possível definir a ordem. Reordene os produtos.");
      }
      const salvo: Produto = {
        ...limpo,
        cores: limpo.cores ?? [],
        detalhes: limpo.detalhes ?? [],
        id: anterior?.id ?? crypto.randomUUID(),
        ordem,
        criadoEm: anterior?.criadoEm ?? agora,
        atualizadoEm: agora,
      };
      await pedir(produtos.put(salvo));
      return salvo;
    });
    avisar();
    return produto;
  },

  async remover(id) {
    const removidas = await transacionar("readwrite", async (transacao) => {
      const produtos = transacao.objectStore("produtos");
      const existentes = await pedir<Produto[]>(produtos.getAll());
      const produto = existentes.find((item) => item.id === id);
      if (!produto) naoEncontrado();
      const usadas = new Set(existentes.filter((item) => item.id !== id).flatMap((item) => item.fotos));
      const fotos = produto.fotos.filter((foto) => !usadas.has(foto));
      await pedir(produtos.delete(id));
      for (const foto of fotos) await pedir(transacao.objectStore("fotos").delete(foto));
      return fotos;
    });
    avisar(removidas);
  },

  async mover(id, direcao) {
    if (direcao !== "subir" && direcao !== "descer") {
      throw new ErroLoja("dados_invalidos", "Informe uma direção válida para mover o produto.");
    }
    const mudou = await transacionar("readwrite", async (transacao) => {
      const store = transacao.objectStore("produtos");
      const todos = await pedir<Produto[]>(store.getAll());
      if (!todos.some((produto) => produto.id === id)) naoEncontrado();
      const visiveis = ordenar(todos.filter((produto) => produto.ativo));
      const indice = visiveis.findIndex((produto) => produto.id === id);
      if (indice < 0) return false;
      const vizinho = visiveis[indice + (direcao === "subir" ? -1 : 1)];
      if (!vizinho) return false;
      const produto = visiveis[indice];
      // Backups podem conter empates; normalizar permite uma troca efetiva.
      if (produto.ordem === vizinho.ordem) {
        const ordenados = ordenar(todos);
        for (const [ordem, item] of ordenados.entries()) {
          item.ordem = ordem;
          await pedir(store.put(item));
        }
      }
      const ordem = produto.ordem;
      produto.ordem = vizinho.ordem;
      vizinho.ordem = ordem;
      produto.atualizadoEm = new Date().toISOString();
      vizinho.atualizadoEm = produto.atualizadoEm;
      await pedir(store.put(produto));
      await pedir(store.put(vizinho));
      return true;
    });
    if (mudou) avisar();
  },

  async guardarFoto(arquivo) {
    if (!(arquivo instanceof Blob) || !/^image\/[\w.+-]+$/.test(arquivo.type) || arquivo.size === 0) {
      throw new ErroLoja("dados_invalidos", "Informe uma foto já preparada e válida.");
    }
    const id = await transacionar("readwrite", async (transacao) => {
      const foto: Foto = { id: crypto.randomUUID(), blob: arquivo, tipo: arquivo.type };
      await pedir(transacao.objectStore("fotos").add(foto));
      return foto.id;
    });
    avisar();
    return id;
  },

  async urlDaFoto(id) {
    conectarCanal();
    try {
      while (true) {
        const existente = urls.get(id);
        if (existente) return existente;
        const versao = revisao;
        const foto = await transacionar("readonly", (transacao) =>
          pedir<Foto | undefined>(transacao.objectStore("fotos").get(id)));
        if (versao !== revisao) continue;
        if (!foto) return null;
        const url = urls.get(id) ?? URL.createObjectURL(foto.blob);
        urls.set(id, url);
        return url;
      }
    } catch (erro) {
      throw erroArmazenamento(erro);
    }
  },

  async removerFoto(id) {
    await transacionar("readwrite", async (transacao) => {
      const store = transacao.objectStore("produtos");
      const produtos = await pedir<Produto[]>(store.getAll());
      for (const produto of produtos) {
        if (!produto.fotos.includes(id)) continue;
        produto.fotos = produto.fotos.filter((foto) => foto !== id);
        produto.atualizadoEm = new Date().toISOString();
        await pedir(store.put(produto));
      }
      await pedir(transacao.objectStore("fotos").delete(id));
    });
    avisar([id]);
  },

  async exportar() {
    try {
      const dados = await transacionar("readonly", async (transacao) => {
        const [produtos, fotos] = await Promise.all([
          pedir<Produto[]>(transacao.objectStore("produtos").getAll()),
          pedir<Foto[]>(transacao.objectStore("fotos").getAll()),
        ]);
        return { produtos, fotos };
      });
      const fotos = await Promise.all(dados.fotos.map(async (foto): Promise<FotoBackup> => ({
        id: foto.id,
        tipo: foto.tipo,
        base64: await paraBase64(foto.blob),
      })));
      const backup: Backup = { versao: 1, produtos: ordenar(dados.produtos), fotos };
      return new Blob([JSON.stringify(backup)], { type: "application/json" });
    } catch (erro) {
      throw erroArmazenamento(erro);
    }
  },

  async importar(arquivo) {
    const dados = await lerBackup(arquivo);
    await transacionar("readwrite", async (transacao) => {
      const produtos = transacao.objectStore("produtos");
      const fotos = transacao.objectStore("fotos");
      await pedir(produtos.clear());
      await pedir(fotos.clear());
      for (const produto of dados.produtos) await pedir(produtos.add(produto));
      for (const foto of dados.fotos) await pedir(fotos.add(foto));
    });
    avisar(null);
    return { produtos: dados.produtos.length };
  },

  ouvir(aoMudar) {
    conectarCanal();
    const ouvinte = () => aoMudar();
    ouvintes.add(ouvinte);
    return () => {
      ouvintes.delete(ouvinte);
    };
  },
};
