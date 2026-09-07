import { useEffect, useState } from "react";
import { SCHOOL, STATUS_META, STATUS_ORDER, type TabId } from "../data";
import {
  IconBook,
  IconCap,
  IconChart,
  IconHome,
  IconPencil,
  IconStar,
  IconUsers,
  Squiggle,
} from "./Icons";

const DUST = [
  { left: "12%", top: "22%", size: 5, delay: "0s" },
  { left: "28%", top: "70%", size: 3, delay: "1.2s" },
  { left: "56%", top: "16%", size: 4, delay: "2.1s" },
  { left: "72%", top: "62%", size: 3, delay: "0.6s" },
  { left: "88%", top: "30%", size: 5, delay: "1.7s" },
  { left: "42%", top: "82%", size: 3, delay: "2.8s" },
];

export default function BoardHeader({
  tab,
  onTab,
}: {
  tab: TabId;
  onTab: (t: TabId) => void;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateLong = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="relative z-10 px-4 pt-6 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        {/* bingkai kayu */}
        <div
          className="rounded-[22px] p-2.5 shadow-card sm:p-3"
          style={{
            background:
              "linear-gradient(135deg,#7a4a1f,#5b3517 40%,#8a5a2b 68%,#4c2b12)",
          }}
        >
          {/* papan tulis */}
          <div
            className="relative overflow-hidden rounded-[14px] bg-board px-5 py-8 sm:px-10 sm:py-10"
            style={{
              backgroundImage:
                "radial-gradient(rgba(242,239,227,0.055) 1px, transparent 1.4px), radial-gradient(ellipse 80% 60% at 50% -10%, rgba(23,83,61,0.9), transparent 70%)",
              backgroundSize: "22px 22px, 100% 100%",
            }}
          >
            {/* debu kapur melayang */}
            {DUST.map((d, i) => (
              <span
                key={i}
                className="chalk-dust pointer-events-none absolute rounded-full bg-chalk/50"
                style={{
                  left: d.left,
                  top: d.top,
                  width: d.size,
                  height: d.size,
                  animationDelay: d.delay,
                }}
              />
            ))}

            {/* coretan kapur */}
            <IconStar
              size={34}
              className="pointer-events-none absolute right-8 top-7 rotate-12 text-chalk/20"
            />
            <IconStar
              size={18}
              className="pointer-events-none absolute right-20 top-16 -rotate-12 text-gold/30"
            />
            <span className="pointer-events-none absolute bottom-8 left-6 hidden -rotate-6 font-display text-sm font-semibold tracking-widest text-chalk/15 md:block">
              a² + b² = c²
            </span>
            <span className="pointer-events-none absolute right-10 bottom-24 hidden rotate-3 font-display text-6xl font-extrabold text-chalk/8 lg:block">
              8C
            </span>

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-xs">
                  <IconCap size={16} />
                  {SCHOOL.name} · TA {SCHOOL.year}
                </p>

                <h1 className="mt-3 font-display text-chalk">
                  <span className="block text-lg font-medium tracking-wide text-chalk/75 sm:text-xl">
                    Absensi Harian
                  </span>
                  <span className="mt-1 block text-5xl font-extrabold leading-[0.95] sm:text-7xl">
                    Kelas <span className="text-gold">8C</span>
                  </span>
                </h1>

                <Squiggle className="squiggle mt-3 w-44 text-gold/80 sm:w-56" />

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    { icon: <IconUsers size={13} />, text: "26 Siswa" },
                    { icon: <IconBook size={13} />, text: SCHOOL.semester },
                    { icon: <IconHome size={13} />, text: SCHOOL.room },
                    { icon: <IconCap size={13} />, text: `Wali Kelas: ${SCHOOL.homeroom}` },
                  ].map((c) => (
                    <span
                      key={c.text}
                      className="flex items-center gap-1.5 rounded-full border border-chalk/20 px-3 py-1.5 text-xs text-chalk/85 transition-colors hover:border-gold/50 hover:text-chalk"
                    >
                      <span className="text-gold">{c.icon}</span>
                      {c.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* jam hidup */}
              <div className="relative shrink-0 self-start rounded-xl border border-chalk/15 bg-board-deep/50 px-6 py-5 text-center lg:self-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-chalk/55">
                  Waktu Sekarang
                </p>
                <p className="tabular mt-1 font-display text-4xl font-bold text-chalk sm:text-5xl">
                  {time}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-gold">{dateLong}</p>
                <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-chalk/65">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hadir opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-hadir" />
                  </span>
                  Data tersimpan otomatis di perangkat
                </p>
              </div>
            </div>

            {/* tab navigasi */}
            <nav className="relative mt-8 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onTab("absensi")}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-display text-sm font-semibold transition-all duration-200 ${
                  tab === "absensi"
                    ? "-translate-y-0.5 border-gold bg-gold text-board-deep shadow-[0_8px_24px_-8px_rgba(240,180,41,0.7)]"
                    : "border-chalk/25 text-chalk/85 hover:-translate-y-0.5 hover:bg-chalk/10 hover:text-chalk"
                }`}
              >
                <IconPencil size={15} />
                Lembar Absensi
              </button>
              <button
                onClick={() => onTab("rekap")}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-display text-sm font-semibold transition-all duration-200 ${
                  tab === "rekap"
                    ? "-translate-y-0.5 border-gold bg-gold text-board-deep shadow-[0_8px_24px_-8px_rgba(240,180,41,0.7)]"
                    : "border-chalk/25 text-chalk/85 hover:-translate-y-0.5 hover:bg-chalk/10 hover:text-chalk"
                }`}
              >
                <IconChart size={15} />
                Rekap &amp; Riwayat
              </button>

              <div className="ml-auto hidden items-center gap-3 text-[11px] text-chalk/65 md:flex">
                {STATUS_ORDER.map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
                    {STATUS_META[s].label}
                  </span>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
