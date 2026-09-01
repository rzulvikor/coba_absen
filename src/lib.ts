import { STATUS_ORDER, type Records, type Status } from "./data";

const STORAGE_KEY = "absensi-kelas-8c:v1";

const pad = (n: number) => String(n).padStart(2, "0");

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatLongID(iso: string): string {
  return parseISO(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortID(iso: string): string {
  return parseISO(iso).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeHM(isoDateTime: string): string {
  const d = new Date(isoDateTime);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function recordKey(date: string, sessionId: string): string {
  return `${date}__${sessionId}`;
}

export function loadRecords(): Records {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Records;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function persistRecords(records: Records): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* penyimpanan penuh / privat — abaikan */
  }
}

export interface Tally {
  H: number;
  S: number;
  I: number;
  A: number;
  marked: number;
}

export function tally(marks: Record<string, Status>): Tally {
  const t: Tally = { H: 0, S: 0, I: 0, A: 0, marked: 0 };
  for (const v of Object.values(marks)) {
    if (v && (STATUS_ORDER as string[]).includes(v)) {
      t[v] += 1;
      t.marked += 1;
    }
  }
  return t;
}

export function initials(name: string): string {
  const parts = name
    .replace(/\./g, "")
    .split(/\s+/)
    .filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export const AVATAR_TONES = [
  "bg-gold/25 text-golddeep",
  "bg-hadir/15 text-hadir",
  "bg-izin/15 text-izin",
  "bg-alpa/10 text-alpa",
  "bg-sakit/15 text-sakit",
];
