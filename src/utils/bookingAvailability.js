import { business } from "../data/barbershop.js";

const SLOT_STEP_MINUTES = 30;
const MINIMUM_NOTICE_MINUTES = 30;

function pad(number) {
  return String(number).padStart(2, "0");
}

export function toLocalISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseLocalISO(isoDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate ?? "")) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return null;
  return date;
}

export function getDaySlots(isoDate, durationMinutes, now = new Date()) {
  const day = parseLocalISO(isoDate);
  const duration = Number(durationMinutes);
  if (!day || !Number.isFinite(duration) || duration <= 0) return [];

  const hours = business.bookingSchedule[day.getDay()];
  if (!hours) return [];

  const cutoff = now.getTime() + MINIMUM_NOTICE_MINUTES * 60_000;
  const result = [];

  for (
    let minutes = hours.open;
    minutes + duration <= hours.close;
    minutes += SLOT_STEP_MINUTES
  ) {
    const appointment = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      Math.floor(minutes / 60),
      minutes % 60
    );

    if (appointment.getTime() <= cutoff) continue;
    result.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`);
  }
  return result;
}

export function getUpcomingBookableDays(
  durationMinutes,
  now = new Date(),
  maxDays = 10
) {
  const result = [];
  for (let offset = 0; offset < 28 && result.length < maxDays; offset++) {
    // Criar em horário local evita alterações de dia em certos fusos horários.
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const iso = toLocalISO(day);
    if (getDaySlots(iso, durationMinutes, now).length === 0) continue;

    result.push({
      iso,
      weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
        .format(day)
        .replace(/\./g, ""),
      number: day.getDate(),
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" })
        .format(day)
        .replace(/\./g, ""),
      fullLabel: new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(day),
      today: offset === 0,
    });
  }
  return result;
}

export const periods = [
  { id: "manha", label: "Manhã" },
  { id: "tarde", label: "Tarde" },
  { id: "fim", label: "Fim do dia" },
];

export function getPeriod(time) {
  const [hour, minute] = time.split(":").map(Number);
  const minutes = hour * 60 + minute;
  if (minutes < 12 * 60) return "manha";
  if (minutes < 17 * 60) return "tarde";
  return "fim";
}

export function getPeriodOptions(slots) {
  return periods.filter((period) => slots.some((time) => getPeriod(time) === period.id));
}

export function formatDateHuman(isoDate) {
  const date = parseLocalISO(isoDate);
  return date
    ? new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(date)
    : "";
}

export function getOperatingLabel(isoDate) {
  const day = parseLocalISO(isoDate);
  if (!day) return "";
  const hours = business.bookingSchedule[day.getDay()];
  if (!hours) return "Fechado";
  return `Atendimento das ${pad(hours.open / 60)}h às ${pad(hours.close / 60)}h`;
}
