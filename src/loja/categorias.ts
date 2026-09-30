import type { CategoriaId } from "./tipos.ts";

export const CATEGORIAS: { id: CategoriaId; nome: string; plural: string }[] = [
  { id: "kites", nome: "Kite", plural: "Kites" },
  { id: "pranchas", nome: "Prancha", plural: "Pranchas" },
  { id: "foil", nome: "Foil", plural: "Foil" },
  { id: "trapezios", nome: "Trapézio", plural: "Trapézios" },
  { id: "bones", nome: "Boné", plural: "Bonés" },
  { id: "vestuario", nome: "Vestuário", plural: "Vestuário" },
  { id: "acessorios", nome: "Acessório", plural: "Acessórios" },
];

export function nomeCategoria(id: CategoriaId): string {
  return CATEGORIAS.find((categoria) => categoria.id === id)?.nome ?? "Categoria desconhecida";
}
