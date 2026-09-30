import { CATEGORIAS } from "./categorias.ts";
import { ErroLoja } from "./tipos.ts";
import type { NovoProduto } from "./tipos.ts";

export function lerPreco(texto: string): number | null | "invalido" {
  const limpo = texto.trim();
  if (!limpo) return null;
  const valor = limpo.replace(/^R\$\s*/, "");
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(valor)) return "invalido";
  const [inteiro, decimal = ""] = valor.replace(/\./g, "").split(",");
  const centavos = Number(inteiro) * 100 + Number(decimal.padEnd(2, "0"));
  return Number.isSafeInteger(centavos) && centavos > 0 && centavos <= 100_000_000 ? centavos : "invalido";
}

export function formatarPreco(centavos: number | null): string {
  if (centavos === null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    .format(centavos / 100).replace(/\u00a0/g, " ");
}

function invalido(mensagem: string): never {
  throw new ErroLoja("dados_invalidos", mensagem);
}

export function normalizarOpcoes(entrada: string | string[]): string[] {
  if (typeof entrada !== "string" && !Array.isArray(entrada)) {
    invalido("Informe as opções como texto ou lista.");
  }
  const partes = typeof entrada === "string" ? entrada.split(/[,;\r\n]/) : entrada;
  const vistas = new Set<string>();
  const opcoes: string[] = [];
  for (const parte of partes) {
    if (typeof parte !== "string") invalido("Cada opção deve ser um texto.");
    const opcao = parte.trim().replace(/\s+/g, " ");
    if (opcao.length > 30) invalido("Cada opção pode ter até 30 caracteres.");
    const chave = opcao.toLocaleLowerCase("pt-BR");
    if (!opcao || vistas.has(chave)) continue;
    vistas.add(chave);
    opcoes.push(opcao);
  }
  if (opcoes.length > 20) invalido("Informe no máximo 20 opções.");
  return opcoes;
}

export function validarProduto(entrada: NovoProduto): NovoProduto {
  if (!entrada || typeof entrada !== "object") invalido("Informe os dados do produto.");
  if (typeof entrada.nome !== "string") invalido("Informe o nome do produto.");
  const nome = entrada.nome.trim().replace(/\s+/g, " ");
  if (nome.length < 2 || nome.length > 80) invalido("O nome deve ter entre 2 e 80 caracteres.");
  if (typeof entrada.descricao !== "string") invalido("A descrição deve ser um texto.");
  const descricao = entrada.descricao.trim();
  if (descricao.length > 1000) invalido("A descrição pode ter até 1.000 caracteres.");
  if (!CATEGORIAS.some((categoria) => categoria.id === entrada.categoria)) {
    invalido("Selecione uma categoria válida.");
  }
  const preco = entrada.precoCentavos;
  if (preco !== null && (!Number.isSafeInteger(preco) || preco <= 0 || preco > 100_000_000)) {
    invalido("Informe um preço positivo de até R$ 1.000.000,00 ou deixe sob consulta.");
  }
  if (!Array.isArray(entrada.opcoes)) invalido("As opções devem ser uma lista.");
  const opcoes = normalizarOpcoes(entrada.opcoes);
  if (!Array.isArray(entrada.fotos) || entrada.fotos.length > 8) {
    invalido("Informe uma lista com no máximo 8 fotos.");
  }
  if (entrada.fotos.some((foto) => typeof foto !== "string" || !foto.trim() || foto !== foto.trim())) {
    invalido("Uma das fotos possui um identificador inválido.");
  }
  if (new Set(entrada.fotos).size !== entrada.fotos.length) invalido("Não repita a mesma foto no produto.");
  for (const campo of ["disponivel", "destaque", "ativo"] as const) {
    if (typeof entrada[campo] !== "boolean") invalido("Informe a disponibilidade, o destaque e a visibilidade.");
  }
  if (entrada.id !== undefined && (typeof entrada.id !== "string" || !entrada.id.trim()
    || entrada.id !== entrada.id.trim())) {
    invalido("O identificador do produto é inválido.");
  }
  return {
    ...(entrada.id === undefined ? {} : { id: entrada.id }),
    nome,
    categoria: entrada.categoria,
    descricao,
    precoCentavos: preco,
    opcoes,
    fotos: [...entrada.fotos],
    disponivel: entrada.disponivel,
    destaque: entrada.destaque,
    ativo: entrada.ativo,
  };
}
