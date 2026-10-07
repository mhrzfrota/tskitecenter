import type { CategoriaId, Produto } from "./tipos.ts";

/**
 * Produtos que a escola manda pelo WhatsApp, fixos no código. Aparecem para
 * todo visitante, sem depender do painel (/admin), que ainda guarda só no
 * navegador de quem cadastra. Quando a loja for ligada ao Supabase, esta
 * lista vira a carga inicial do banco.
 *
 * Fotos em public/produtos, sem corte (a vitrine usa object-contain).
 * Preço em centavos; null mostra "Consultar".
 */
type Item = {
  id: string;
  nome: string;
  categoria: CategoriaId;
  preco: number | null; // em reais
  foto: string;
  descricao?: string;
  opcoes?: string[];
  cores?: string[];
  detalhes?: string[];
  destaque?: boolean;
};

const ITENS: Item[] = [
  // Primeiro produto (era o de teste do painel, com public/produtos/prod1.jpg)
  {
    id: "duotone-fin-box-carbon-30",
    nome: "Duotone Fin Box Carbon 30 FS 5.0",
    categoria: "acessorios",
    preco: 550,
    foto: "duotone-fin-box-carbon-30",
    detalhes: ["Marca: Duotone", "Material: carbono"],
  },
  // Recebidos em 2026-10-06 (print do WhatsApp da escola)
  {
    id: "trapezio-ride-engine-saber",
    nome: "Trapézio Ride Engine Saber",
    categoria: "trapezios",
    preco: 3000,
    foto: "trapezio-ride-engine-saber",
    cores: ["Laranja"],
    detalhes: ["Marca: Ride Engine", "Modelo: Saber"],
    destaque: true,
  },
  {
    id: "bomba-duotone-xl",
    nome: "Bomba Duotone XL",
    categoria: "acessorios",
    preco: 600,
    foto: "bomba-duotone-xl",
    detalhes: ["Marca: Duotone", "Tamanho: XL"],
    destaque: true,
  },
  {
    id: "quilhas-north-40mm",
    nome: "Quilhas North 40 mm",
    categoria: "acessorios",
    preco: 500,
    foto: "quilhas-north-40mm",
    detalhes: ["Marca: North", "Altura: 40 mm"],
    destaque: true,
  },
  {
    id: "chicken-loop",
    nome: "Chicken loop",
    categoria: "acessorios",
    preco: 450,
    foto: "chicken-loop",
    opcoes: ["G"],
  },
  {
    id: "reparo-alcas-duotone",
    nome: "Reparo de alças Duotone (impressão 3D)",
    categoria: "acessorios",
    preco: 250,
    foto: "reparo-alcas-duotone",
    detalhes: ["Compatível com: alças Duotone", "Fabricação: impressão 3D"],
  },
  {
    id: "finger-north",
    nome: "Finger North",
    categoria: "acessorios",
    preco: 160,
    foto: "finger-north",
    detalhes: ["Marca: North"],
  },
  {
    id: "bolsa-waterproof-10l",
    nome: "Bolsa Waterproof 10 L",
    categoria: "acessorios",
    preco: 150,
    foto: "bolsa-waterproof-10l",
    cores: ["Verde"],
    detalhes: ["Capacidade: 10 litros"],
  },
  {
    id: "protetor-brazinco",
    nome: "Protetor solar Brazinco",
    categoria: "acessorios",
    preco: 120,
    foto: "protetor-brazinco",
    detalhes: ["Marca: Brazinco", "Proteção: FPS 50"],
  },
  {
    id: "kit-3-mangueiras",
    nome: "Kit 3 mangueiras",
    categoria: "acessorios",
    preco: 30,
    foto: "kit-3-mangueiras",
    detalhes: ["Quantidade: 3 unidades"],
  },
  {
    id: "quilhas-brunotti-40mm",
    nome: "Quilhas Brunotti 40 mm",
    categoria: "acessorios",
    preco: null, // a escola não mandou o preço
    foto: "quilhas-brunotti-40mm",
    detalhes: ["Marca: Brunotti", "Altura: 40 mm"],
  },
];

const DATA = "2026-10-06T00:00:00.000Z";

export const CATALOGO: Produto[] = ITENS.map((item, ordem) => ({
  id: item.id,
  nome: item.nome,
  categoria: item.categoria,
  descricao: item.descricao ?? "",
  precoCentavos: item.preco === null ? null : Math.round(item.preco * 100),
  opcoes: item.opcoes ?? [],
  cores: item.cores ?? [],
  detalhes: item.detalhes ?? [],
  fotos: [`/produtos/${item.foto}.webp`],
  disponivel: true,
  destaque: item.destaque ?? false,
  ativo: true,
  ordem,
  criadoEm: DATA,
  atualizadoEm: DATA,
}));

/** Foto do catálogo fixo é um caminho do site; foto do painel é um id do IndexedDB. */
export const ehFotoFixa = (id: string) => id.startsWith("/");

/** Fotos já recortadas (fundo branco). As outras foram tiradas com cenário (grama, plantas). */
const RECORTADAS = new Set(["/produtos/duotone-fin-box-carbon-30.webp", "/produtos/protetor-brazinco.webp"]);

/** Foto com cenário: a vitrine mostra inteira, sobre uma cópia desfocada dela, em vez de flutuar no cinza. */
export const fotoComCenario = (id: string) => ehFotoFixa(id) && !RECORTADAS.has(id);
