import { test } from "node:test";
import assert from "node:assert/strict";
import { agoraFortaleza, estadoAgora, extremos, porDia } from "../src/mare.ts";

// Senoide de 12h25 (maré semidiurna), cheia exatamente às 02:00
const horas = Array.from({ length: 48 }, (_, i) => new Date(Date.UTC(2026, 9, 7, i)).toISOString().slice(0, 16));
const niveis = horas.map((_, i) => 1.5 * Math.cos((2 * Math.PI * (i - 2)) / 12.42));

test("acha cheias e secas alternadas, com o minuto interpolado", () => {
  const e = extremos(horas, niveis, 0);
  assert.equal(e[0].tipo, "cheia");
  assert.equal(e[0].quando, "2026-10-07T02:00");
  assert.equal(e[1].tipo, "seca");
  assert.ok(Math.abs(Date.parse(e[1].quando + ":00Z") - Date.parse("2026-10-07T08:13:00Z")) <= 3 * 60000, e[1].quando);
  for (let i = 1; i < e.length; i++) assert.notEqual(e[i].tipo, e[i - 1].tipo);
  assert.ok(Math.abs(e[0].altura - 1.5) < 0.05);
});

test("soma o ajuste de horário e vira o dia certo", () => {
  const e = extremos(["2026-10-07T22:00", "2026-10-07T23:00", "2026-10-08T00:00"], [1, 2, 1], 90);
  assert.equal(e[0].quando, "2026-10-08T00:30");
});

test("ignora buracos na série", () => {
  assert.equal(extremos(["a", "b", "c"].map((_, i) => `2026-10-07T0${i}:00`), [1, null, 1]).length, 0);
});

test("enchendo antes da cheia, vazando antes da seca", () => {
  const e = extremos(horas, niveis, 0);
  assert.equal(estadoAgora(e, "2026-10-07T01:00")?.subindo, true);
  assert.equal(estadoAgora(e, "2026-10-07T05:00")?.subindo, false);
  assert.equal(estadoAgora(e, "2026-10-09T05:00"), null);
});

test("agrupa por dia", () => {
  const dias = porDia(extremos(horas, niveis, 0));
  assert.deepEqual(dias.map(([d]) => d), ["2026-10-07", "2026-10-08"]);
});

test("agora em Fortaleza é UTC-3", () => {
  assert.equal(agoraFortaleza(new Date("2026-10-07T15:20:00Z")), "2026-10-07T12:20");
});
