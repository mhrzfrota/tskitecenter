import test from "node:test";
import assert from "node:assert/strict";
import { idDoEndereco, nomeDaCor, relacionados, separarDetalhe, tonsDaCor } from "../src/loja/vitrine.ts";
import { normalizarCores, normalizarDetalhes, validarProduto } from "../src/loja/validacao.ts";
import type { Produto } from "../src/loja/tipos.ts";

test("cor pelo nome, composta e por hex", () => {
  assert.deepEqual(tonsDaCor("Azul"), ["#1F5FD6"]);
  assert.deepEqual(tonsDaCor("azul-marinho"), ["#14284B"]);
  assert.deepEqual(tonsDaCor("Preto/Amarelo"), ["#111111", "#F2CC2E"]);
  assert.deepEqual(tonsDaCor("Petróleo #0f5560"), ["#0F5560"]);
  assert.deepEqual(tonsDaCor("Nebulosa"), []);
  assert.equal(nomeDaCor("Petróleo #0F5560"), "Petróleo");
});

test("detalhe vira rótulo e valor", () => {
  assert.deepEqual(separarDetalhe("Material: Dacron 2027"), { rotulo: "Material", valor: "Dacron 2027" });
  assert.deepEqual(separarDetalhe("Acompanha bolsa"), { texto: "Acompanha bolsa" });
  assert.deepEqual(separarDetalhe("Peso:"), { texto: "Peso:" });
});

test("normaliza cores e detalhes", () => {
  assert.deepEqual(normalizarCores("Azul, azul; Preto "), ["Azul", "Preto"]);
  assert.deepEqual(normalizarDetalhes("- Material: Dacron\n\n• Peso: 3 kg\n"), ["Material: Dacron", "Peso: 3 kg"]);
  assert.throws(() => normalizarCores(Array.from({ length: 13 }, (_, i) => `Cor ${i}`)));
});

test("produto antigo sem cores e detalhes continua válido", () => {
  const limpo = validarProduto({ nome: "Kite", categoria: "kites", descricao: "", precoCentavos: null, opcoes: [], fotos: [], disponivel: true, destaque: false, ativo: true });
  assert.deepEqual(limpo.cores, []);
  assert.deepEqual(limpo.detalhes, []);
});

const p = (id: string, categoria: Produto["categoria"], extra: Partial<Produto> = {}): Produto => ({
  id, nome: id, categoria, descricao: "", precoCentavos: null, opcoes: [], cores: [], detalhes: [], fotos: [],
  disponivel: true, destaque: false, ativo: true, ordem: 0, criadoEm: "", atualizadoEm: "", ...extra,
});

test("relacionados: mesma categoria primeiro, sem o próprio e sem inativos", () => {
  const todos = [p("a", "kites"), p("b", "bones", { destaque: true }), p("c", "kites", { ordem: 2 }), p("d", "kites", { ativo: false }), p("e", "kites", { ordem: 1 })];
  assert.deepEqual(relacionados(todos[0], todos, 3).map((x) => x.id), ["e", "c", "b"]);
});

test("id do endereço", () => {
  assert.equal(idDoEndereco("/produto/abc-123"), "abc-123");
  assert.equal(idDoEndereco("/produto", "?id=xyz"), "xyz");
  assert.equal(idDoEndereco("/produto/%E0%A4%A"), "");
});
