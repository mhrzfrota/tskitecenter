export type CategoriaId = "kites" | "pranchas" | "foil" | "trapezios" | "bones" | "vestuario" | "acessorios";

export type Produto = {
  id: string;
  nome: string;
  categoria: CategoriaId;
  descricao: string;
  precoCentavos: number | null;
  opcoes: string[];
  fotos: string[];
  disponivel: boolean;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  criadoEm: string;
  atualizadoEm: string;
};

export type NovoProduto = Omit<Produto, "id" | "criadoEm" | "atualizadoEm" | "ordem"> & { id?: string };

export class ErroLoja extends Error {
  codigo: "dados_invalidos" | "nao_encontrado" | "armazenamento";

  constructor(codigo: ErroLoja["codigo"], mensagem: string) {
    super(mensagem);
    this.name = "ErroLoja";
    this.codigo = codigo;
  }
}
