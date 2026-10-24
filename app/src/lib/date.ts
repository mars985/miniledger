export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISODate() {
  return toISODate(new Date());
}

export function parseISODate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfToday() {
  return parseISODate(todayISODate());
}

export function formatDate(value: string | Date) {
  const date =
    typeof value !== "string" ? value : value.length === 10 ? parseISODate(value) : new Date(value);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysBetween(fromISODate: string, toISO: string) {
  const ms = parseISODate(toISO).getTime() - parseISODate(fromISODate).getTime();
  return Math.round(ms / 86_400_000);
}
