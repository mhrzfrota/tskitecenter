import type { Produto } from "./tipos.ts";

/**
 * Regras da página do produto, sem tela: cor do nome, detalhe em rótulo e
 * valor, e quais produtos sugerir.
 */

const sem = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Nomes de cor mais usados em loja de kite, em português e inglês. */
const CORES: Record<string, string> = {
  preto: "#111111", black: "#111111",
  branco: "#FFFFFF", white: "#FFFFFF",
  cinza: "#8A9399", grey: "#8A9399", gray: "#8A9399", grafite: "#3F4549",
  azul: "#1F5FD6", blue: "#1F5FD6", marinho: "#14284B", navy: "#14284B", "azul marinho": "#14284B",
  "azul claro": "#7FB8E6", turquesa: "#14B8C4", teal: "#0F8C99", ciano: "#22C3D6",
  verde: "#2E9E57", green: "#2E9E57", "verde limao": "#B7D433", lima: "#B7D433", lime: "#B7D433",
  amarelo: "#F2CC2E", yellow: "#F2CC2E",
  laranja: "#F2792E", orange: "#F2792E",
  vermelho: "#D93A30", red: "#D93A30",
  rosa: "#EC6FA5", pink: "#EC6FA5",
  roxo: "#7B4BC4", purple: "#7B4BC4", lilas: "#B79BE0",
  bege: "#D9C7A7", areia: "#D9C7A7", sand: "#D9C7A7",
  marrom: "#7A5233", brown: "#7A5233",
  dourado: "#C9A23A", gold: "#C9A23A", prata: "#B8BEC3", silver: "#B8BEC3",
};

/**
 * Hex de uma cor pelo nome. Aceita "Azul", "azul-claro", ou um hex no fim
 * ("Azul petróleo #0F5560"). Cor composta ("Preto/Amarelo") devolve as duas.
 */
export function tonsDaCor(nome: string): string[] {
  const hex = nome.match(/#[0-9a-f]{6}\b/i)?.[0];
  if (hex) return [hex.toUpperCase()];
  return nome
    .split(/\s*[/&+]\s*|\s+e\s+/i)
    .map((parte) => CORES[sem(parte).replace(/-/g, " ")])
    .filter((c): c is string => Boolean(c));
}

/** Nome para mostrar, sem o hex. */
export const nomeDaCor = (nome: string) => nome.replace(/\s*#[0-9a-f]{6}\b/i, "").trim() || nome;

/** "Material: Dacron" vira rótulo e valor; linha sem dois-pontos é um item solto. */
export function separarDetalhe(linha: string): { rotulo: string; valor: string } | { texto: string } {
  const i = linha.indexOf(":");
  if (i > 0 && i <= 40 && linha.slice(i + 1).trim()) return { rotulo: linha.slice(0, i).trim(), valor: linha.slice(i + 1).trim() };
  return { texto: linha };
}

/** Relacionados: mesma categoria primeiro (destaques antes), depois o resto; nunca o próprio. */
export function relacionados(produto: Produto, todos: Produto[], quantos = 4): Produto[] {
  const outros = todos.filter((p) => p.id !== produto.id && p.ativo);
  const pontos = (p: Produto) => (p.categoria === produto.categoria ? 2 : 0) + (p.destaque ? 1 : 0) + (p.disponivel ? 0.5 : 0);
  return [...outros].sort((a, b) => pontos(b) - pontos(a) || a.ordem - b.ordem).slice(0, quantos);
}

/** Endereço da página do produto. */
export const linkProduto = (id: string) => `/produto/${encodeURIComponent(id)}`;

/** Lê o id do endereço (/produto/<id>), aceitando ?id= também. */
export function idDoEndereco(caminho: string, busca = ""): string {
  const m = caminho.match(/^\/produto\/([^/?#]+)/);
  if (m) {
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return "";
    }
  }
  return new URLSearchParams(busca).get("id") ?? "";
}
