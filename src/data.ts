export type Status = "H" | "S" | "I" | "A";
export type TabId = "absensi" | "rekap";

export interface Student {
  id: string;
  no: number;
  name: string;
  nis: string;
}

export interface Session {
  id: string;
  time: string;
  subject: string;
  teacher: string;
}

export interface AttendanceRecord {
  date: string;
  sessionId: string;
  marks: Record<string, Status>;
  updatedAt: string;
  savedAt?: string;
}

export type Records = Record<string, AttendanceRecord>;

export const SCHOOL = {
  name: "SMP Negeri 27",
  klass: "8C",
  year: "2026/2027",
  semester: "Semester Genap",
  room: "Ruang 2.7",
  homeroom: "Rina Kartika Sari, S.Pd.",
};

export const STATUS_ORDER: Status[] = ["H", "S", "I", "A"];

export const STATUS_META: Record<
  Status,
  {
    label: string;
    dot: string;
    text: string;
    softBg: string;
    solid: string;
  }
> = {
  H: {
    label: "Hadir",
    dot: "bg-hadir",
    text: "text-hadir",
    softBg: "bg-hadir/8",
    solid: "bg-hadir",
  },
  S: {
    label: "Sakit",
    dot: "bg-sakit",
    text: "text-sakit",
    softBg: "bg-sakit/8",
    solid: "bg-sakit",
  },
  I: {
    label: "Izin",
    dot: "bg-izin",
    text: "text-izin",
    softBg: "bg-izin/8",
    solid: "bg-izin",
  },
  A: {
    label: "Alpa",
    dot: "bg-alpa",
    text: "text-alpa",
    softBg: "bg-alpa/8",
    solid: "bg-alpa",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

const NAMES = [
  "Adinda Putri Maharani",
  "Ahmad Fauzan Ramadhan",
  "Aisyah Nur Ramadhani",
  "Alif Rizky Pratama",
  "Anindya Larasati",
  "Bagas Saputra",
  "Bianca Aurelia Salsabila",
  "Daffa Arya Wijaya",
  "Della Anjani",
  "Dimas Anggara Putra",
  "Fajar Nugroho",
  "Farhan Maulana",
  "Gita Permata Sari",
  "Intan Permatasari",
  "Kevin Ardiansyah",
  "Laila Rahma Azzahra",
  "Muhammad Rafi Alghifari",
  "Nabila Khairunnisa",
  "Naufal Zaki Firmansyah",
  "Putri Ayu Lestari",
  "Rangga Aditya Pratama",
  "Reyhan Putra Pratama",
  "Salsabila Zahra",
  "Tiara Andini",
  "Yusuf Habibi",
  "Zaskia Aulia Rahma",
];

export const STUDENTS: Student[] = NAMES.map((name, i) => ({
  id: `p${pad(i + 1)}`,
  no: i + 1,
  name,
  nis: `2627-8C-${pad(i + 1)}`,
}));

export const SESSIONS: Session[] = [
  { id: "j01", time: "07.00–07.40", subject: "Matematika", teacher: "Dra. Sri Wahyuni" },
  { id: "j02", time: "07.40–08.20", subject: "Matematika", teacher: "Dra. Sri Wahyuni" },
  { id: "j03", time: "08.20–09.00", subject: "Bahasa Indonesia", teacher: "Rina Kartika Sari, S.Pd." },
  { id: "j04", time: "09.15–09.55", subject: "Bahasa Indonesia", teacher: "Rina Kartika Sari, S.Pd." },
  { id: "j05", time: "09.55–10.35", subject: "IPA Terpadu", teacher: "Budi Santoso, M.Pd." },
  { id: "j06", time: "10.35–11.15", subject: "IPA Terpadu", teacher: "Budi Santoso, M.Pd." },
  { id: "j07", time: "11.15–11.55", subject: "IPS", teacher: "Ahmad Hidayat, S.Sos." },
  { id: "j08", time: "12.30–13.10", subject: "Bahasa Inggris", teacher: "Maya Anggraini, S.Pd." },
  { id: "j09", time: "13.10–13.50", subject: "PAI", teacher: "Hasan Basri, S.Ag." },
  { id: "j10", time: "13.50–14.30", subject: "PJOK", teacher: "Joko Prasetyo, S.Pd." },
];
