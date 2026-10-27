# Task Tracker

Aplikasi task tracker berbasis web dengan desain neobrutalism, responsif mobile-first, dan data tersimpan di localStorage (tanpa server).

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## 🎯 Fitur

### Fase 1 - Inti ✅
- **CRUD Task** — Tambah, edit, hapus task dengan judul, catatan, prioritas, kategori, deadline
- **Subtask & Progress** — Checklist di dalam task dengan progress bar visual
- **Deadline Indicator** — Menampilkan "Hari ini", "Besok", "Terlambat X hari" (merah untuk overdue)
- **Status Task** — Todo, Sedang Dikerjakan, Selesai (toggle cepat dengan checkbox)
- **Undo Delete** — Tombol urungkan muncul 5 detik setelah hapus
- **Empty State & Loading** — UI informatif saat tidak ada task atau sedang loading
- **Hydration Safe** — Tidak ada mismatch antara server dan client

### Fase 2 - Mature ✅
- **Pencarian** — Cari berdasarkan judul, catatan, atau kategori
- **Filter & Sort** — Filter status, prioritas; sort deadline (ascending), prioritas, terbaru
- **Dashboard Ringkas** — Total task, selesai hari ini, overdue, progress mingguan (4 stat cards)
- **Dual View** — List (grid 1–3 kolom) dan Board (kolom todo/doing/done)
- **Export/Import JSON** — Backup ke file, restore dari file (dengan validasi schema)
- **Responsive Design** — 360px (mobile) → 768px (tablet) → 1280px+ (desktop)
- **Neobrutalism UI** — Border tebal (2–3px), hard shadow, tipografi bold, warna kontras
- **FAB Button** — Floating action button (+) di kanan bawah untuk add task
- **Safe Area Inset** — Hormati safe area di notch/cutout phone

### Fase 3 - Roadmap 🔄
- Task berulang (harian, mingguan, bulanan)
- Notifikasi pengingat (Notification API)
- Drag-and-drop (reorder, pindah kolom Board)
- Arsip task selesai
- Dark mode (Tailwind siap)
- Keyboard shortcut (N=task baru, /=search, Esc=tutup)

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS 3.4 (utility-first) |
| **Storage** | localStorage (browser) |
| **PWA** | Web Manifest, Service Worker ready |
| **Build** | Webpack (Next.js), ESLint, tsc |

## 📦 Setup & Install

### Prasyarat
- Node.js 18+
- npm atau yarn

### Clone & Setup
```bash
git clone https://github.com/sandiinthegarage/Task-Tracker.git
cd Task-Tracker
npm install
```

### Development
```bash
npm run dev
# Akses: http://localhost:3000
```

### Build Produksi
```bash
npm run build
npm run start
# Jalankan hasil build (static + server)
```

### Type Check & Lint
```bash
npx tsc --noEmit    # Check TypeScript
npm run lint        # ESLint (konfigurasi di .eslintrc.json)
```

## 📁 Struktur Folder

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, metadata
│   │   ├── page.tsx            # Main page (list/board view)
│   │   ├── globals.css         # Global styles
│   │   └── manifest.ts         # PWA manifest
│   ├── components/
│   │   ├── dashboard/          # StatsCards, FilterBar, ImportExportPanel
│   │   ├── tasks/              # TaskCard, TaskForm, BoardView, SubtaskList
│   │   └── ui/                 # Button, Badge, EmptyState, LoadingSkeleton, Toast
│   ├── hooks/
│   │   ├── useTaskStorage.ts   # Read/write localStorage, sync antar tab
│   │   └── useTheme.ts         # Dark mode preference (future)
│   ├── lib/
│   │   ├── types.ts            # Task, Subtask, Priority, Status interface
│   │   ├── date.ts             # formatDeadline, isOverdue, sortTasks, generateId
│   │   └── export.ts           # exportTasks, importTasks, validateImport, download
│   └── ...
├── public/                     # Icons (192, 512, maskable), sw.js
├── tailwind.config.ts          # Theme: colors, shadows, spacing
├── next.config.mjs
├── tsconfig.json
├── package.json
├── .eslintrc.json
├── .gitignore
└── AGENTS.md                   # Spek desain & requirement lengkap
```

## 🎨 Desain & Konvensi

### Bahasa & Aksesibilitas
- **UI Language:** Bahasa Indonesia (ID)
- **TypeScript strict** — Tidak ada `any`, tipe harus eksplisit
- **Penamaan:**
  - Komponen: `PascalCase` (TaskCard.tsx)
  - Fungsi & variabel: `camelCase`
  - Konstanta: `UPPER_SNAKE_CASE`

### Styling (Tailwind)
- **Utility-first** — Tidak ada custom CSS kecuali untuk safe area
- **Neobrutalism:**
  - Border: `border-3 border-fg` (hitam tebal)
  - Shadow: `shadow-brutal` (`4px 4px 0px 0px #000`, tanpa blur)
  - Rounded: `rounded-none` (sharp corner)
- **Token Warna:**
  ```js
  colors: {
    bg: "#FFFFFF",
    fg: "#000000",
    accent: "#FFD700",      // Kuning
    danger: "#FF3B30",       // Merah
    success: "#34C759",      // Hijau
    warning: "#FF9500",      // Orange
  }
  ```

### Komponen
- **Server Component by default** — Tambah `"use client"` hanya kalau butuh state/effect/event
- **Props immutable** — Jangan mutate props langsung
- **Error boundary** — Catch hydration mismatch, JSON parse error

### Storage (Critical)
- **Key:** `taskTracker:v1`
- **Schema versioning:** Simpan `schemaVersion: 1` untuk migrasi masa depan
- **Akses hanya via hook** — `useTaskStorage()`, bukan `localStorage.getItem()` langsung
- **Baca di useEffect saja** — Hindari hydration mismatch
- **Sync antar tab** — Event listener `storage` untuk update real-time

## 📋 Data Model

```typescript
type Priority = "low" | "medium" | "high";
type Status = "todo" | "doing" | "done";

interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

interface Task {
  id: string;                    // crypto.randomUUID() / fallback UUID
  title: string;                 // Wajib, max 120 char
  notes?: string;
  status: Status;
  priority: Priority;
  category?: string;             // Contoh: Kuliah, Proyek, Pribadi
  deadline?: string;             // ISO date string
  subtasks: Subtask[];
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  completedAt?: string;          // ISO timestamp (saat status jadi "done")
}

interface StorageData {
  schemaVersion: number;
  tasks: Task[];
}
```

## 🚀 Usage

### Tambah Task
1. Klik tombol FAB (+) atau "Tambah Task"
2. Isi judul (wajib), catatan, prioritas, kategori, deadline
3. Klik "Tambah Task"
4. Task muncul di list, otomatis tersimpan ke localStorage

### Edit Task
1. Klik tombol "Edit" di task card
2. Ubah data
3. Klik "Perbarui"

### Toggle Status
1. Klik status badge di task card (Akan Dikerjakan → Sedang Dikerjakan → Selesai)
2. Selesai → mendapat `completedAt` timestamp
3. Task selesai pindah ke bawah list

### Subtask
1. Buka task (atau lihat di card)
2. Scroll ke bagian subtask
3. Isi "Tambah subtask" dan klik +
4. Centang checkbox untuk toggle selesai
5. Progress bar otomatis update

### Filter & Cari
- **Search:** Ketik di kolom pencarian (cari judul, catatan, kategori)
- **Filter Status:** Klik tombol "Semua / Akan Dikerjakan / Sedang Dikerjakan / Selesai"
- **Filter Prioritas:** Klik tombol "Semua / Rendah / Sedang / Tinggi"
- Filter dapat dikombinasikan

### View Toggle
- **List:** Grid responsive (2 kolom mobile, 3+ desktop)
- **Board:** Kolom todo/doing/done (horizontal scroll mobile, wrap desktop)

### Export/Import
1. Klik tombol ⚙️ (settings) di header
2. **Export:** Klik 📥 → Download `tasks-YYYY-MM-DD.json`
3. **Import:** Klik 📤 → Pilih file JSON → Auto merge ke localStorage

### Undo Delete
- Tombol "Urungkan" muncul di toast (5 detik) setelah hapus task

## 📱 Responsive Breakpoint

| Ukuran | Layout |
|--------|--------|
| **360–767px** | Mobile 1 kolom, FAB bottom, filter horizontal scroll |
| **768–1023px** | Tablet 2 kolom list, form modal |
| **1024px+** | Desktop 3+ kolom list, full Board view |

**Mobile-first principle:**
- Tulis style dasar untuk 360px
- Gunakan `md:` (768px) dan `lg:` (1024px) untuk override
- `min-h-dvh` (bukan 100vh) agar tidak tertutup address bar
- Safe area inset: `env(safe-area-inset-bottom)` untuk FAB & navbar
- Touch target minimal 44x44px

## 🔐 Security & Best Practice

- **Validasi Import:** Schema version check, array type check sebelum merge
- **No Server/Auth:** Tidak ada dependency eksternal, semua local
- **XSS Safe:** React auto-escape, no innerHTML
- **localStorage Limit:** ~5–10MB per origin (cukup untuk ribuan task)
- **Offline First:** App jalan tanpa internet, PWA siap

## 🐛 Known Issues & Limitations

- **Multi-device sync:** Manual export/import (tidak ada real-time sync)
- **Conflict resolution:** Tidak ada merge strategy (gunakan latest version)
- **Notification:** Tidak jalan kalau app tertutup (butuh service worker + push service)
- **Dark mode:** UI ready tapi toggle belum wired
- **Drag-drop:** Belum implementasi, ada di Fase 3

## 📈 Performance

- **First Load JS:** ~93.6 kB (optimized Next.js bundle)
- **Lighthouse:** Target 90+ (SEO, Performance, Accessibility, Best Practice)
- **Runtime:** ~0ms render (React 18 concurrent)

## 🤝 Contributing

1. Fork repository
2. Buat branch feature: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m "feat: deskripsi"`
4. Push: `git push origin feature/nama-fitur`
5. Buat Pull Request

**Development workflow:**
```bash
# Build check
npm run build
npx tsc --noEmit
npm run lint

# Test di mobile (localhost:3000 dari device lain)
npm run dev -- -H 0.0.0.0
```

## 📜 License

MIT License — Bebas digunakan untuk proyek personal atau komersial.

## 👨‍💻 Author

Yudha Sandi Nugroho
- GitHub: [@sandiinthegarage](https://github.com/sandiinthegarage)

## 📞 Support

Buat issue di GitHub untuk bug report atau feature request.

---

**Last Updated:** 27 Oktober 2026  
**Version:** 0.1.0 (MVP Fase 1–2)  
**Status:** Active Development
