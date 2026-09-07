import { useEffect, useRef, useState } from "react";
import {
  SESSIONS,
  STATUS_META,
  STATUS_ORDER,
  type AttendanceRecord,
  type Records,
  type Student,
} from "../data";
import { formatShortID, tally, timeHM } from "../lib";
import {
  IconBook,
  IconChart,
  IconCheck,
  IconCheckCheck,
  IconDownload,
  IconPencil,
  IconTrash,
} from "./Icons";

interface Props {
  records: Records;
  students: Student[];
  onEdit: (r: AttendanceRecord) => void;
  onDelete: (key: string) => void;
  onExport: () => void;
  onGoSheet: () => void;
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      onClick={() => {
        if (!armed) {
          setArmed(true);
          timer.current = window.setTimeout(() => setArmed(false), 2600);
        } else {
          window.clearTimeout(timer.current);
          setArmed(false);
          onConfirm();
        }
      }}
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-bold transition active:scale-95 ${
        armed
          ? "border-alpa bg-alpa text-white"
          : "border-alpa/40 text-[#f1a1a1] hover:bg-alpa/20"
      }`}
    >
      <IconTrash size={13} />
      {armed ? "Yakin? Klik lagi" : "Hapus"}
    </button>
  );
}

export default function RekapView({
  records,
  students,
  onEdit,
  onDelete,
  onExport,
  onGoSheet,
}: Props) {
  const history = Object.entries(records)
    .map(([key, r]) => ({ key, ...r, t: tally(r.marks) }))
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      const ia = SESSIONS.findIndex((s) => s.id === a.sessionId);
      const ib = SESSIONS.findIndex((s) => s.id === b.sessionId);
      return ia - ib;
    });

  const totalSessions = history.length;
  const totalHadir = history.reduce((acc, r) => acc + r.t.H, 0);
  const avgPct = totalSessions
    ? Math.round(
        history.reduce(
          (acc, r) => acc + (r.t.H / Math.max(students.length, 1)) * 100,
          0
        ) / totalSessions
      )
    : 0;

  const perStudent = students.map((st) => {
    let h = 0,
      s = 0,
      i = 0,
      a = 0;
    for (const r of history) {
      const m = r.marks[st.id];
      if (m === "H") h++;
      else if (m === "S") s++;
      else if (m === "I") i++;
      else if (m === "A") a++;
    }
    const pct = totalSessions ? Math.round((h / totalSessions) * 100) : 0;
    return { st, h, s, i, a, pct };
  });

  const stats = [
    {
      icon: <IconBook size={18} />,
      label: "Sesi Tercatat",
      value: String(totalSessions),
      sub: "lembar tersimpan",
    },
    {
      icon: <IconChart size={18} />,
      label: "Rata-rata Kehadiran",
      value: `${avgPct}%`,
      sub: "dari seluruh sesi",
    },
    {
      icon: <IconCheckCheck size={18} />,
      label: "Total Tanda Hadir",
      value: String(totalHadir),
      sub: "akumulasi semua sesi",
    },
  ];

  return (
    <div className="animate-rise">
      {/* statistik umum */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {stats.map((s, idx) => (
          <div
            key={s.label}
            className="animate-rise flex items-center gap-4 rounded-xl border border-chalk/12 bg-board p-4 shadow-card sm:p-5"
            style={{ animationDelay: `${idx * 90}ms` }}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
              {s.icon}
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-chalk/50">
                {s.label}
              </span>
              <span className="tabular block font-display text-3xl font-extrabold leading-tight text-gold">
                {s.value}
              </span>
              <span className="block text-[11px] text-chalk/55">{s.sub}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* kehadiran per siswa */}
        <section className="animate-rise overflow-hidden rounded-lg border border-black/10 bg-paper shadow-sheet" style={{ animationDelay: "120ms" }}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paperline px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-extrabold text-ink">
                Kehadiran per Siswa
              </h2>
              <p className="text-xs text-inksoft">
                Akumulasi dari {totalSessions} sesi tersimpan
              </p>
            </div>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 rounded-lg bg-board px-3.5 py-2 text-xs font-bold text-chalk transition hover:bg-board-soft active:scale-95"
            >
              <IconDownload size={14} />
              Unduh CSV
            </button>
          </div>

          <div>
            {perStudent.map(({ st, h, s, i, a, pct }) => (
              <div
                key={st.id}
                className="flex items-center gap-3 border-b border-paperline/70 px-5 py-3 transition-colors last:border-0 hover:bg-paperline/25"
              >
                <span className="w-6 shrink-0 text-center font-display text-xs font-bold text-inksoft">
                  {st.no}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{st.name}</p>
                    <p className="tabular shrink-0 font-display text-sm font-bold text-ink">
                      {totalSessions ? `${pct}%` : "—"}
                    </p>
                  </div>
                  <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-paperline">
                    {totalSessions > 0 && (
                      <>
                        <span
                          className="bg-hadir transition-all duration-700"
                          style={{ width: `${(h / totalSessions) * 100}%` }}
                        />
                        <span
                          className="bg-sakit transition-all duration-700"
                          style={{ width: `${(s / totalSessions) * 100}%` }}
                        />
                        <span
                          className="bg-izin transition-all duration-700"
                          style={{ width: `${(i / totalSessions) * 100}%` }}
                        />
                        <span
                          className="bg-alpa transition-all duration-700"
                          style={{ width: `${(a / totalSessions) * 100}%` }}
                        />
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-inksoft">
                    <span className="text-hadir">{h} hadir</span> ·{" "}
                    <span className="text-sakit">{s} sakit</span> ·{" "}
                    <span className="text-izin">{i} izin</span> ·{" "}
                    <span className="text-alpa">{a} alpa</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* riwayat */}
        <section className="animate-rise" style={{ animationDelay: "200ms" }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-chalk">
              Riwayat Absensi
            </h2>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
              {totalSessions} tersimpan
            </span>
          </div>

          {history.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-chalk/20 p-10 text-center">
              <IconBook size={40} className="mx-auto text-chalk/30" />
              <p className="mt-4 font-display text-lg font-bold text-chalk/80">
                Belum ada riwayat
              </p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-chalk/55">
                Tandai status siswa lalu simpan lembar absensi — riwayatnya akan
                muncul di sini.
              </p>
              <button
                onClick={onGoSheet}
                className="mt-5 rounded-lg bg-gold px-5 py-2.5 font-display text-sm font-bold text-board-deep transition hover:bg-goldsoft active:scale-95"
              >
                Buka Lembar Absensi
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((r) => {
                const session = SESSIONS.find((x) => x.id === r.sessionId);
                const pct = Math.round(
                  (r.t.H / Math.max(students.length, 1)) * 100
                );
                return (
                  <div
                    key={r.key}
                    className="group rounded-lg border border-chalk/12 bg-board/70 p-4 transition hover:border-gold/40"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="font-display text-sm font-bold text-chalk">
                        {formatShortID(r.date)}
                      </p>
                      <p className="text-[11px] text-chalk/60">
                        {session?.time} · {session?.subject}
                      </p>
                      {r.savedAt && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-gold">
                          <IconCheck size={11} />
                          {timeHM(r.savedAt)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {STATUS_ORDER.map((k) => (
                        <span
                          key={k}
                          title={STATUS_META[k].label}
                          className="flex items-center gap-1.5 rounded-full bg-chalk/8 px-2.5 py-1 text-[11px] font-bold text-chalk/90"
                        >
                          <span className={`h-2 w-2 rounded-full ${STATUS_META[k].dot}`} />
                          {r.t[k]} {STATUS_META[k].label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <p className="mr-auto text-[11px] text-chalk/55">
                        Kehadiran <b className="text-gold">{pct}%</b> · {r.t.marked}/
                        {students.length} ditandai
                      </p>
                      <button
                        onClick={() => onEdit(r)}
                        className="flex items-center gap-1.5 rounded-md border border-gold/35 px-2.5 py-1.5 text-[11px] font-bold text-gold transition hover:bg-gold/15 active:scale-95"
                      >
                        <IconPencil size={12} />
                        Buka
                      </button>
                      <DeleteButton onConfirm={() => onDelete(r.key)} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
