/*
// Convert UTC ISO time string to local time in local format
export function formatLocal(isoUtc: string) {
  return new Date(isoUtc).toLocaleString(navigator.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
*/

// Convert UTC ISO time string to local time in "YYYY-MM-DD HH:mm" format
export function formatLocal(isoUtc: string) {
  const d = new Date(isoUtc);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
