import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { CATALOGO } from "../src/loja/catalogo.ts";
import { validarProduto } from "../src/loja/validacao.ts";

test("catálogo fixo: ids únicos", () => {
  assert.equal(new Set(CATALOGO.map((p) => p.id)).size, CATALOGO.length);
});

test("catálogo fixo: toda foto existe em public/", () => {
  for (const p of CATALOGO) {
    assert.ok(p.fotos.length > 0, `${p.nome} sem foto`);
    for (const f of p.fotos) assert.ok(existsSync(new URL(`../public${f}`, import.meta.url)), `${p.nome}: ${f} não existe`);
  }
});

test("catálogo fixo: passa na mesma validação do painel", () => {
  for (const p of CATALOGO) assert.doesNotThrow(() => validarProduto(p), p.nome);
});
