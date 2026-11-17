import test from "node:test";
import assert from "node:assert/strict";

import {
  getDaySlots,
  getUpcomingBookableDays,
  getPeriodOptions,
  parseLocalISO,
} from "../src/utils/bookingAvailability.js";

test("não permite agendamentos aos domingos", () => {
  const now = new Date(2026, 10, 14, 8, 0);
  assert.deepEqual(getDaySlots("2026-11-15", 40, now), []);
});

test("respeita a duração de 60 minutos e fechamento às 17h no sábado", () => {
  const slots = getDaySlots("2026-11-21", 60, new Date(2026, 10, 20, 8, 0));
  assert.equal(slots[0], "09:00");
  assert.equal(slots.at(-1), "16:00");
  assert.ok(!slots.includes("16:30"));
});

test("não oferece horários passados nem abaixo de 30 minutos de antecedência", () => {
  const slots = getDaySlots("2026-11-16", 40, new Date(2026, 10, 16, 9, 10));
  assert.equal(slots[0], "10:00");
  assert.ok(!slots.includes("09:30"));
});

test("não oferece datas anteriores à data atual", () => {
  const slots = getDaySlots("2026-11-16", 25, new Date(2026, 10, 17, 8, 0));
  assert.deepEqual(slots, []);
});

test("rejeita datas impossíveis e durações inválidas", () => {
  assert.equal(parseLocalISO("2026-02-30"), null);
  assert.deepEqual(getDaySlots("2026-11-16", 0), []);
});

test("seleciona próximos dias com horário possível", () => {
  const days = getUpcomingBookableDays(40, new Date(2026, 10, 14, 20, 0), 6);
  assert.equal(days.length, 6);
  assert.equal(days[0].iso, "2026-11-16");
  assert.ok(days.every((day) => getDaySlots(day.iso, 40, new Date(2026, 10, 14, 20, 0)).length > 0));
});

test("separa horários disponíveis em períodos coerentes", () => {
  assert.deepEqual(getPeriodOptions(["09:00", "14:00", "17:30"]).map((x) => x.id), ["manha", "tarde", "fim"]);
});
