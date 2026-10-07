import { CATALOGO, ehFotoFixa } from "./catalogo.ts";
import { lojaLocal } from "./local.ts";
import type { RepositorioLoja } from "./repositorio.ts";

/**
 * O que o visitante vê: só o catálogo fixo (catalogo.ts). O painel (/admin)
 * guarda no navegador de quem cadastra e usa `lojaLocal` direto; o que estiver
 * lá não aparece no site até a loja ir para o Supabase. Assim, produto de
 * teste salvo no navegador de alguém nunca vira vitrine.
 */
export const lojaSite: RepositorioLoja = {
  ...lojaLocal,

  async listar(filtro = {}) {
    return CATALOGO.filter((p) => (filtro.incluirInativos || p.ativo)
      && (!filtro.categoria || p.categoria === filtro.categoria)
      && (!filtro.somenteDestaques || p.destaque));
  },

  async obter(id) {
    return CATALOGO.find((p) => p.id === id) ?? null;
  },

  async urlDaFoto(id) {
    return ehFotoFixa(id) ? id : lojaLocal.urlDaFoto(id);
  },
};
