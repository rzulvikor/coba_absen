import { useEffect, useRef, useState } from "react";
import BoardHeader from "./components/BoardHeader";
import AttendanceSheet from "./components/AttendanceSheet";
import RekapView from "./components/RekapView";
import { IconAlert, IconCheck, IconInfo } from "./components/Icons";
import {
  SCHOOL,
  SESSIONS,
  STUDENTS,
  type AttendanceRecord,
  type Records,
  type Status,
  type TabId,
} from "./data";
import {
  loadRecords,
  persistRecords,
  recordKey,
  tally,
  todayISO,
} from "./lib";

interface ToastState {
  id: number;
  msg: string;
  kind: "success" | "warn" | "info";
}

export default function App() {
  const [records, setRecords] = useState<Records>(() => loadRecords());
  const [tab, setTab] = useState<TabId>("absensi");
  const [date, setDate] = useState<string>(() => todayISO());
  const [sessionId, setSessionId] = useState<string>(SESSIONS[0].id);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    persistRecords(records);
  }, [records]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const showToast = (msg: string, kind: ToastState["kind"]) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), msg, kind });
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  };

  const key = recordKey(date, sessionId);
  const current = records[key];
  const marks = current?.marks ?? {};

  const handleMark = (studentId: string, s: Status) => {
    setRecords((prev) => {
      const rec = prev[key];
      const nextMarks: Record<string, Status> = { ...(rec?.marks ?? {}) };
      if (nextMarks[studentId] === s) delete nextMarks[studentId];
      else nextMarks[studentId] = s;

      const next = { ...prev };
      if (Object.keys(nextMarks).length === 0) {
        delete next[key];
      } else {
        next[key] = {
          date,
          sessionId,
          marks: nextMarks,
          updatedAt: new Date().toISOString(),
          savedAt: rec?.savedAt,
        };
      }
      return next;
    });
  };

  const handleAllHadir = () => {
    const all: Record<string, Status> = {};
    for (const st of STUDENTS) all[st.id] = "H";
    setRecords((prev) => ({
      ...prev,
      [key]: {
        date,
        sessionId,
        marks: all,
        updatedAt: new Date().toISOString(),
        savedAt: prev[key]?.savedAt,
      },
    }));
    showToast("Semua siswa ditandai hadir — jangan lupa disimpan.", "info");
  };

  const handleReset = () => {
    if (!records[key]) {
      showToast("Lembar ini sudah kosong.", "info");
      return;
    }
    setRecords((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    showToast("Lembar absensi dikosongkan.", "info");
  };

  const handleSave = () => {
    const t = tally(marks);
    if (t.marked === 0) {
      showToast("Belum ada status yang ditandai di lembar ini.", "warn");
      return;
    }
    const now = new Date().toISOString();
    setRecords((prev) => ({
      ...prev,
      [key]: {
        date,
        sessionId,
        marks,
        updatedAt: now,
        savedAt: now,
      },
    }));
    if (t.marked < STUDENTS.length) {
      showToast(
        `Tersimpan — ${t.H} hadir, ${t.marked}/${STUDENTS.length} siswa ditandai.`,
        "warn"
      );
    } else {
      showToast(
        `Absensi lengkap tersimpan — ${t.H}/${STUDENTS.length} siswa hadir.`,
        "success"
      );
    }
  };

  const handleEdit = (r: AttendanceRecord) => {
    setDate(r.date);
    setSessionId(r.sessionId);
    setTab("absensi");
    showToast("Lembar dimuat untuk diedit.", "info");
  };

  const handleDelete = (k: string) => {
    setRecords((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
    showToast("Riwayat absensi dihapus.", "info");
  };

  const handleExport = () => {
    const entries = Object.values(records);
    if (entries.length === 0) {
      showToast("Belum ada data untuk diekspor.", "warn");
      return;
    }
    const header = [
      "No",
      "Nama",
      "NIS",
      "Hadir",
      "Sakit",
      "Izin",
      "Alpa",
      "Persen Hadir",
    ];
    const rows = STUDENTS.map((st) => {
      let h = 0,
        s = 0,
        i = 0,
        a = 0;
      for (const r of entries) {
        const m = r.marks[st.id];
        if (m === "H") h++;
        else if (m === "S") s++;
        else if (m === "I") i++;
        else if (m === "A") a++;
      }
      const pct = entries.length ? Math.round((h / entries.length) * 100) : 0;
      return [st.no, st.name, st.nis, h, s, i, a, `${pct}%`];
    });
    const csv =
      "\uFEFF" +
      [header, ...rows].map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap-absensi-kelas-8c-${todayISO()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Rekap kehadiran diunduh sebagai CSV.", "success");
  };

  return (
    <div className="relative min-h-screen font-sans">
      <BoardHeader tab={tab} onTab={setTab} />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-6">
        {tab === "absensi" ? (
          <AttendanceSheet
            key={`sheet-${date}-${sessionId}`}
            students={STUDENTS}
            sessions={SESSIONS}
            date={date}
            sessionId={sessionId}
            onDate={setDate}
            onSession={setSessionId}
            marks={marks}
            onMark={handleMark}
            onAllHadir={handleAllHadir}
            onReset={handleReset}
            onSave={handleSave}
            savedAt={current?.savedAt}
          />
        ) : (
          <RekapView
            records={records}
            students={STUDENTS}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
            onGoSheet={() => setTab("absensi")}
          />
        )}
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-4 text-center">
        <p className="text-xs text-chalk/45">
          Absensi Kelas 8C · {SCHOOL.name} · TA {SCHOOL.year} — dikembangkan oleh{" "}
          <span className="font-semibold text-gold/80">27 Golden Project</span>
        </p>
        <p className="mt-1 text-[11px] text-chalk/30">
          Seluruh data tersimpan secara lokal di perangkat ini.
        </p>
      </footer>

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="animate-toast fixed bottom-6 left-1/2 z-50 flex max-w-[92vw] items-center gap-3 rounded-xl border border-chalk/15 bg-board-deep px-5 py-3.5 text-sm font-semibold text-chalk shadow-card"
        >
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
              toast.kind === "success"
                ? "bg-hadir/20 text-hadir"
                : toast.kind === "warn"
                  ? "bg-gold/20 text-gold"
                  : "bg-izin/20 text-[#8ab6f5]"
            }`}
          >
            {toast.kind === "success" ? (
              <IconCheck size={15} />
            ) : toast.kind === "warn" ? (
              <IconAlert size={15} />
            ) : (
              <IconInfo size={15} />
            )}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
