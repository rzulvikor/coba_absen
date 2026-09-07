import {
  STATUS_META,
  STATUS_ORDER,
  type Session,
  type Status,
  type Student,
} from "../data";
import {
  AVATAR_TONES,
  formatLongID,
  initials,
  tally,
  timeHM,
} from "../lib";
import {
  IconCheck,
  IconCheckCheck,
  IconClock,
  IconReset,
  IconSave,
} from "./Icons";

interface Props {
  students: Student[];
  sessions: Session[];
  date: string;
  sessionId: string;
  onDate: (v: string) => void;
  onSession: (v: string) => void;
  marks: Record<string, Status>;
  onMark: (studentId: string, s: Status) => void;
  onAllHadir: () => void;
  onReset: () => void;
  onSave: () => void;
  savedAt?: string;
}

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

export default function AttendanceSheet({
  students,
  sessions,
  date,
  sessionId,
  onDate,
  onSession,
  marks,
  onMark,
  onAllHadir,
  onReset,
  onSave,
  savedAt,
}: Props) {
  const t = tally(marks);
  const unmarked = students.length - t.marked;
  const pct = students.length ? Math.round((t.H / students.length) * 100) : 0;
  const session = sessions.find((s) => s.id === sessionId) ?? sessions[0];

  return (
    <div className="animate-rise">
      {/* kartu kendali */}
      <section className="mt-6 overflow-hidden rounded-xl border border-chalk/12 bg-board shadow-card">
        <div className="grid items-end gap-4 p-4 sm:p-5 md:grid-cols-[1fr_1.3fr_auto]">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-chalk/55">
              Tanggal Absensi
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => e.target.value && onDate(e.target.value)}
              className="w-full rounded-lg border border-chalk/15 bg-board-deep/70 px-3 py-2.5 text-sm font-semibold text-chalk outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/30"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-chalk/55">
              Jam Pelajaran
            </span>
            <select
              value={sessionId}
              onChange={(e) => onSession(e.target.value)}
              className="w-full rounded-lg border border-chalk/15 bg-board-deep/70 px-3 py-2.5 text-sm font-semibold text-chalk outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/30"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.time} — {s.subject}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onAllHadir}
              className="flex items-center gap-1.5 rounded-lg bg-hadir px-3.5 py-2.5 text-xs font-bold text-white transition hover:brightness-110 active:scale-95 sm:text-sm"
            >
              <IconCheckCheck size={16} />
              Semua Hadir
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-chalk/20 px-3.5 py-2.5 text-xs font-bold text-chalk/85 transition hover:bg-chalk/10 active:scale-95 sm:text-sm"
            >
              <IconReset size={15} />
              Kosongkan
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-chalk/10 px-4 py-2.5 text-xs text-chalk/70 sm:px-5">
          <span className="flex items-center gap-1.5">
            <IconClock size={14} className="text-gold" />
            {session.time}
          </span>
          <span>
            Mapel: <b className="text-chalk">{session.subject}</b>
          </span>
          <span>Pengajar: {session.teacher}</span>
          <span className="ml-auto flex items-center gap-2">
            {unmarked > 0 && (
              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 font-semibold text-gold">
                {unmarked} belum ditandai
              </span>
            )}
            {savedAt ? (
              <span className="flex items-center gap-1 font-semibold text-gold">
                <IconCheck size={13} />
                Disimpan {timeHM(savedAt)}
              </span>
            ) : (
              <span className="text-chalk/45">Belum disimpan</span>
            )}
          </span>
        </div>
      </section>

      {/* lembar absensi kertas */}
      <section className="relative mt-6">
        <div className="relative overflow-hidden rounded-lg border border-black/10 bg-paper shadow-sheet">
          {/* lubang binder */}
          <div className="absolute inset-y-0 left-3 z-10 hidden flex-col justify-center gap-24 sm:flex">
            <span className="h-5 w-5 rounded-full bg-board-deep/90 shadow-[inset_0_2px_5px_rgba(0,0,0,0.55)]" />
            <span className="h-5 w-5 rounded-full bg-board-deep/90 shadow-[inset_0_2px_5px_rgba(0,0,0,0.55)]" />
            <span className="h-5 w-5 rounded-full bg-board-deep/90 shadow-[inset_0_2px_5px_rgba(0,0,0,0.55)]" />
          </div>
          {/* garis margin merah */}
          <span className="absolute inset-y-0 left-14 hidden w-px bg-marginred/50 sm:block" />

          {/* ringkasan lengket */}
          <div className="sticky top-3 z-20 mx-3 mt-3 rounded-lg border border-gold/25 bg-board-deep text-chalk shadow-card sm:mx-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
              {STATUS_ORDER.map((s) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_META[s].dot}`} />
                  <span
                    key={`${s}-${t[s]}`}
                    className="tabular animate-pop font-display text-xl font-bold"
                  >
                    {t[s]}
                  </span>
                  <span className="hidden text-[10px] uppercase tracking-wider text-chalk/50 sm:inline">
                    {STATUS_META[s].label}
                  </span>
                </span>
              ))}

              <span className="ml-auto flex items-center gap-3">
                <svg width="56" height="56" viewBox="0 0 64 64" className="-rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r={RING_R}
                    fill="none"
                    stroke="rgba(242,239,227,0.14)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r={RING_R}
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C * (1 - pct / 100)}
                    style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                </svg>
                <span>
                  <span className="block font-display text-sm font-bold leading-tight">
                    Kehadiran <span className="tabular text-gold">{pct}%</span>
                  </span>
                  <span className="block text-[11px] text-chalk/60">
                    {t.H} dari {students.length} siswa hadir
                  </span>
                </span>

                <button
                  onClick={onSave}
                  className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-display text-sm font-bold text-board-deep shadow transition hover:bg-goldsoft active:scale-95"
                >
                  <IconSave size={16} />
                  Simpan
                </button>
              </span>
            </div>
          </div>

          {/* kepala lembar */}
          <div className="flex items-baseline justify-between border-b border-paperline px-4 pb-3 pt-5 sm:px-6">
            <div>
              <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                Lembar Absensi
              </h2>
              <p className="mt-0.5 text-xs text-inksoft">
                {formatLongID(date)} · {session.time} · {session.subject}
              </p>
            </div>
            <span className="hidden font-display text-3xl font-extrabold text-ink/15 sm:block">
              8C
            </span>
          </div>

          {/* header kolom */}
          <div className="hidden grid-cols-[64px_1fr_auto] gap-3 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-inksoft sm:grid">
            <span>No</span>
            <span>Nama Siswa</span>
            <span className="pr-1">Status — klik untuk menandai</span>
          </div>

          <ul className="divide-y divide-paperline">
            {students.map((st, i) => {
              const s = marks[st.id];
              const meta = s ? STATUS_META[s] : null;
              return (
                <li
                  key={st.id}
                  className={`animate-rise relative grid grid-cols-[auto_1fr] items-center gap-3 px-4 py-3 transition-colors duration-300 sm:grid-cols-[64px_1fr_auto] sm:px-6 ${
                    meta ? meta.softBg : "hover:bg-paperline/30"
                  }`}
                  style={{ animationDelay: `${Math.min(i * 35, 450)}ms` }}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border font-display text-sm font-bold transition-all duration-300 ${
                      meta
                        ? `${meta.solid} scale-105 border-transparent text-white shadow-md`
                        : "border-ink/15 bg-white text-inksoft"
                    }`}
                  >
                    {st.no}
                  </span>

                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-xs font-bold sm:h-10 sm:w-10 ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
                    >
                      {initials(st.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink sm:text-[15px]">
                        {st.name}
                      </span>
                      <span className="block text-[11px] text-inksoft">
                        NIS {st.nis}
                        {meta && (
                          <span className={`ml-2 font-bold ${meta.text}`}>
                            · {meta.label}
                          </span>
                        )}
                      </span>
                    </span>
                  </span>

                  <span className="col-span-2 flex flex-wrap justify-start gap-1.5 sm:col-span-1 sm:justify-end">
                    {STATUS_ORDER.map((k) => {
                      const m = STATUS_META[k];
                      const active = s === k;
                      return (
                        <button
                          key={k}
                          onClick={() => onMark(st.id, k)}
                          aria-pressed={active}
                          title={m.label}
                          className={`h-9 rounded-md font-display text-sm font-bold transition-all duration-200 active:scale-90 ${
                            active
                              ? `${m.solid} px-3 text-white shadow-md`
                              : "border border-ink/10 bg-white px-3 text-inksoft hover:-translate-y-0.5 hover:border-ink/30 hover:text-ink"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {k}
                            {active && (
                              <span className="hidden font-sans text-[11px] font-semibold md:inline">
                                {m.label}
                              </span>
                            )}
                            {active && <IconCheck size={13} />}
                          </span>
                        </button>
                      );
                    })}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap justify-between gap-2 border-t border-paperline px-4 py-4 text-[11px] text-inksoft sm:px-6">
            <span>
              <b className="text-hadir">H</b> Hadir · <b className="text-sakit">S</b> Sakit ·{" "}
              <b className="text-izin">I</b> Izin · <b className="text-alpa">A</b> Alpa
            </span>
            <span>Klik status yang sama lagi untuk membatalkan tanda.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
