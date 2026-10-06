import test from "node:test";
import assert from "node:assert/strict";
import { lerPreco, formatarPreco, normalizarOpcoes, validarProduto } from "../src/loja/validacao.ts";
import { ErroLoja } from "../src/loja/tipos.ts";
import type { NovoProduto } from "../src/loja/tipos.ts";
import { CATEGORIAS, nomeCategoria } from "../src/loja/categorias.ts";

const produto = (): NovoProduto => ({
  nome: "Kite de teste",
  categoria: "kites",
  descricao: "",
  precoCentavos: null,
  opcoes: [],
  cores: [],
  detalhes: [],
  fotos: [],
  disponivel: true,
  destaque: false,
  ativo: true,
});

function erroValido(erro: unknown): boolean {
  assert.ok(erro instanceof ErroLoja);
  assert.equal(erro.codigo, "dados_invalidos");
  assert.ok(erro.message.length > 10);
  assert.ok(!erro.message.includes("\u2014"));
  return true;
}

test("lerPreco aceita os formatos brasileiros e os limites", () => {
  const casos: [string, number | null][] = [
    ["", null], ["   ", null], ["1500", 150000], ["1500,00", 150000], ["1.500,00", 150000],
    ["1.500", 150000], ["R$ 1.500,90", 150090], ["89,9", 8990], ["  R$ 89,90  ", 8990],
    ["0,01", 1], ["1.000.000,00", 100000000], ["1000000", 100000000], ["R$\u00a010,00", 1000],
  ];
  for (const [entrada, esperado] of casos) assert.equal(lerPreco(entrada), esperado, entrada);
});

test("lerPreco recusa valores inválidos e separadores incorretos", () => {
  const casos = [
    "-1", "-0,01", "0", "0,00", "R$ 0", "abc", "10 reais", "1,001", "1.000.000,01",
    "1000001", "1.50", "1,500.00", "1.5000", "1..500", "1 500", "1e3", "Infinity", "NaN",
    "+10", "R$", "10,", ",90", "999999999999999999999999999999", "R$ R$ 10",
  ];
  for (const entrada of casos) assert.equal(lerPreco(entrada), "invalido", entrada);
});

test("formatarPreco retorna reais ou Sob consulta", () => {
  assert.equal(formatarPreco(null), "Sob consulta");
  assert.equal(formatarPreco(150000), "R$ 1.500,00");
  assert.equal(formatarPreco(8990), "R$ 89,90");
  assert.equal(formatarPreco(1), "R$ 0,01");
  assert.equal(formatarPreco(100000000), "R$ 1.000.000,00");
});

test("normalizarOpcoes separa, limpa e remove repetições mantendo a primeira grafia", () => {
  assert.deepEqual(normalizarOpcoes("9 m, 12 m; 14m\n9 M\r\n ;"), ["9 m", "12 m", "14m"]);
  const entrada = ["  Azul  marinho ", "AZUL MARINHO", "", " Único ", "ÚNICO"];
  const copia = [...entrada];
  assert.deepEqual(normalizarOpcoes(entrada), ["Azul marinho", "Único"]);
  assert.deepEqual(entrada, copia);
  assert.deepEqual(normalizarOpcoes(" , ; \n"), []);
  assert.deepEqual(normalizarOpcoes([]), []);
});

test("normalizarOpcoes aceita os limites depois de remover repetições", () => {
  assert.deepEqual(normalizarOpcoes(["a".repeat(30)]), ["a".repeat(30)]);
  const vinte = Array.from({ length: 20 }, (_, indice) => String(indice));
  assert.deepEqual(normalizarOpcoes([...vinte, "0"]), vinte);
});

test("normalizarOpcoes recusa excesso e entradas malformadas", () => {
  assert.throws(() => normalizarOpcoes(["a".repeat(31)]), erroValido);
  assert.throws(() => normalizarOpcoes(Array.from({ length: 21 }, (_, i) => String(i))), erroValido);
  for (const entrada of [null, undefined, 1, {}, [1], [null]]) {
    assert.throws(() => normalizarOpcoes(entrada as string[]), erroValido);
  }
});

test("validarProduto limpa sem alterar a entrada e preserva todos os campos do contrato", () => {
  const entrada = {
    ...produto(),
    id: "produto-1",
    nome: "  Kite \n  azul ",
    descricao: "  Descrição com acento.  ",
    precoCentavos: 150000,
    opcoes: [" 9 m ", "9 M", "12 m"],
    fotos: ["foto-1"],
  };
  const copia = structuredClone(entrada);
  const limpo = validarProduto(entrada);
  assert.deepEqual(limpo, {
    ...entrada,
    nome: "Kite azul",
    descricao: "Descrição com acento.",
    opcoes: ["9 m", "12 m"],
  });
  assert.deepEqual(entrada, copia);
  assert.notEqual(limpo.fotos, entrada.fotos);
  assert.notEqual(limpo.opcoes, entrada.opcoes);
});

test("validarProduto aceita categorias, preços opcionais, limites e estados falsos", () => {
  for (const categoria of CATEGORIAS) {
    assert.equal(validarProduto({ ...produto(), categoria: categoria.id }).categoria, categoria.id);
  }
  assert.equal(nomeCategoria("trapezios"), "Trapézio");
  assert.equal(nomeCategoria("foil"), "Foil");
  assert.equal(validarProduto({ ...produto(), nome: "AB" }).nome, "AB");
  const entrada = {
    ...produto(),
    nome: "a".repeat(80),
    descricao: "a".repeat(1000),
    fotos: Array.from({ length: 8 }, (_, i) => `foto-${i}`),
    precoCentavos: 100000000,
    disponivel: false,
    destaque: false,
    ativo: false,
  };
  assert.deepEqual(validarProduto(entrada), entrada);
  assert.equal(validarProduto(produto()).precoCentavos, null);
  assert.equal(validarProduto({ ...produto(), precoCentavos: 1 }).precoCentavos, 1);
});

test("validarProduto recusa nomes, descrições, categorias e preços inválidos", () => {
  const casos = [
    { nome: "" }, { nome: " a " }, { nome: "a".repeat(81) }, { nome: null },
    { descricao: "a".repeat(1001) }, { descricao: 1 }, { categoria: "outra" },
    { precoCentavos: 0 }, { precoCentavos: -1 }, { precoCentavos: 1.5 },
    { precoCentavos: NaN }, { precoCentavos: Infinity }, { precoCentavos: 100000001 },
    { precoCentavos: "100" }, { precoCentavos: undefined },
  ];
  for (const campos of casos) {
    assert.throws(() => validarProduto({ ...produto(), ...campos } as NovoProduto), erroValido);
  }
});

test("validarProduto recusa fotos, opções, identificadores e estados inválidos", () => {
  const casos = [
    { fotos: Array.from({ length: 9 }, (_, i) => `foto-${i}`) }, { fotos: ["a", "a"] },
    { fotos: [""] }, { fotos: [" foto "] }, { fotos: [1] }, { fotos: null },
    { opcoes: "9 m" }, { opcoes: ["a".repeat(31)] }, { opcoes: null },
    { opcoes: Array.from({ length: 21 }, (_, i) => String(i)) },
    { id: "" }, { id: " id " }, { id: null }, { id: 1 },
    { disponivel: "sim" }, { destaque: 1 }, { ativo: undefined },
  ];
  for (const campos of casos) {
    assert.throws(() => validarProduto({ ...produto(), ...campos } as NovoProduto), erroValido);
  }
  for (const entrada of [null, undefined, {}, [], "produto"]) {
    assert.throws(() => validarProduto(entrada as NovoProduto), erroValido);
  }
});
