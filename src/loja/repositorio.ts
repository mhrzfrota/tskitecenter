import type { CategoriaId, NovoProduto, Produto } from "./tipos.ts";

export interface RepositorioLoja {
  listar(filtro?: {
    categoria?: CategoriaId;
    incluirInativos?: boolean;
    somenteDestaques?: boolean;
  }): Promise<Produto[]>;
  obter(id: string): Promise<Produto | null>;
  salvar(entrada: NovoProduto): Promise<Produto>;
  remover(id: string): Promise<void>;
  mover(id: string, direcao: "subir" | "descer"): Promise<void>;
  guardarFoto(arquivo: Blob): Promise<string>;
  urlDaFoto(id: string): Promise<string | null>;
  removerFoto(id: string): Promise<void>;
  exportar(): Promise<Blob>;
  importar(arquivo: Blob): Promise<{ produtos: number }>;
  ouvir(aoMudar: () => void): () => void;
}
