# AGENTS.md - Task Tracker

## 1. Ringkasan
Task tracker berbasis web, rasa aplikasi native. **Next.js (App Router) + TypeScript + Tailwind CSS**. Data disimpan di localStorage (tanpa server, tanpa auth). Bisa di-install sebagai PWA.

**Desain:** Neobrutalism. Border tebal, hard shadow, warna kontras, tipografi bold.
**Prioritas device:** Mobile-first. Harus nyaman di HP (360px) sampai desktop (1440px+).

## 2. Struktur Folder
```text
├── src/
│   ├── app/                 # layout.tsx, page.tsx, globals.css, manifest.ts
│   ├── components/
│   │   ├── layout/          # AppShell, Sidebar, BottomNav, Header
│   │   ├── tasks/           # TaskCard, TaskList, TaskForm, SubtaskList, FilterBar
│   │   ├── dashboard/       # StatsCards, ProgressRing
│   │   └── ui/              # Button, Modal, BottomSheet, Toast, Badge, EmptyState
│   ├── hooks/               # useTaskStorage, useMediaQuery, useTheme
│   ├── lib/                 # types.ts, constants.ts, date.ts, export.ts
│   └── ...
├── public/                  # icons (192, 512, maskable), sw.js
├── tailwind.config.ts       # kalau Tailwind v4: pakai @theme di globals.css
└── next.config.mjs
```

## 3. Konvensi Kode
*   **Bahasa:** TypeScript strict. Tidak boleh `any`.
*   **Penamaan:** PascalCase untuk file komponen, camelCase untuk variabel dan fungsi, UPPER_SNAKE untuk konstanta.
*   **Styling:** Tailwind utility. Border 2-3px, hard shadow (`shadow-[4px_4px_0_0_#000]`), tanpa blur. Token warna dan shadow didefinisikan sekali di config tema, jangan hardcode berulang. CSS custom hanya boleh untuk hal yang tidak bisa dengan Tailwind (safe-area, scrollbar).
*   **Komponen:** Server Component by default. Tambah `"use client"` hanya kalau butuh state, effect, atau event.
*   **Bahasa UI:** Bahasa Indonesia.

## 4. Data Model
```ts
type Priority = "low" | "medium" | "high";
type Status = "todo" | "doing" | "done";

interface Subtask { id: string; title: string; done: boolean }

interface Task {
  id: string;              // crypto.randomUUID()
  title: string;           // wajib, maks 120 karakter
  notes?: string;
  status: Status;
  priority: Priority;
  category?: string;       // contoh: Kuliah, Proyek, Pribadi
  deadline?: string;       // ISO string, opsional
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```
*   Storage key: `taskTracker:v1`. Simpan juga `schemaVersion` supaya migrasi ke depan aman.
*   Semua akses localStorage lewat hook `useTaskStorage`. Tidak boleh akses langsung dari komponen.

## 5. Aturan Storage (penting, sering jadi bug)
*   Next.js merender di server, jadi `localStorage` tidak ada saat SSR. Baca storage **hanya di `useEffect`**, dan tampilkan skeleton sampai data siap (flag `isHydrated`). Ini mencegah hydration mismatch.
*   Bungkus `JSON.parse` dengan try/catch. Kalau data rusak, fallback ke array kosong dan jangan crash.
*   Sinkronkan antar tab lewat event `storage`.
*   Urutan default: task belum selesai diurutkan **deadline terdekat dulu (ascending)**, task tanpa deadline di bawah, task `done` paling bawah. Jangan descending, karena deadline paling jauh malah tampil duluan.

## 6. Fitur (kerjakan bertahap sesuai fase)

### Fase 1 - Inti
*   Tambah, edit, hapus task (form: judul, catatan, prioritas, kategori, deadline).
*   Ubah status: todo, doing, done (tap checkbox untuk toggle cepat).
*   Subtask / checklist di dalam task, dengan progress bar.
*   Indikator deadline: "Hari ini", "Besok", "Terlambat 2 hari" (merah untuk overdue).
*   Undo setelah hapus atau selesai (toast dengan tombol Urungkan, 5 detik).
*   Empty state dan loading skeleton.

### Fase 2 - Terasa seperti aplikasi
*   Pencarian (judul dan catatan).
*   Filter: status, prioritas, kategori, "Terlambat", "Hari ini". Sort: deadline, prioritas, terbaru.
*   Dashboard ringkas: total, selesai hari ini, overdue, progress mingguan.
*   Tampilan: List dan Board (kolom todo / doing / done). Board scroll horizontal di HP.
*   Dark mode (ikut sistem, bisa di-toggle, simpan pilihan).
*   Export dan import JSON (backup data), dengan validasi sebelum import.
*   Shortcut keyboard di desktop: `N` task baru, `/` fokus search, `Esc` tutup modal.

### Fase 3 - Polish
*   Task berulang (harian, mingguan).
*   Notifikasi pengingat deadline via Notification API (hanya saat izin diberikan, dan jujur soal keterbatasan: tidak jalan kalau app tertutup tanpa server push).
*   Drag-and-drop untuk reorder dan pindah kolom di Board.
*   Arsip task selesai.

## 7. Aturan UI Responsif
Mobile-first: tulis style dasar untuk HP, lalu tambah `md:` dan `lg:`.

| Lebar | Layout |
|---|---|
| < 768px (HP) | Satu kolom. **BottomNav** (Tugas, Board, Statistik, Pengaturan). Tombol tambah berupa **FAB** kanan bawah. Form tambah/edit muncul sebagai **BottomSheet**. |
| 768-1023px (tablet) | Satu kolom lebar dengan header atas. Form sebagai Modal tengah. |
| >= 1024px (desktop) | **Sidebar** kiri tetap (navigasi + filter kategori). Konten maks `max-w-5xl`. Bisa split view: daftar di kiri, detail task di kanan. Form sebagai Modal. |

Aturan wajib:
*   Target sentuh minimal 44x44px.
*   Tidak boleh ada horizontal scroll di body. Hanya Board yang boleh scroll horizontal di dalam container sendiri.
*   Pakai `min-h-dvh` (bukan `100vh`) agar tidak tertutup address bar HP.
*   Hormati safe area: `pb-[env(safe-area-inset-bottom)]` untuk BottomNav dan FAB. Viewport meta pakai `viewport-fit=cover`.
*   Input teks minimal `text-base` (16px) supaya iOS tidak auto-zoom.
*   Hover effect hanya di perangkat yang punya hover (`@media (hover: hover)`), efek tekan (`active:translate-x-1 active:translate-y-1 active:shadow-none`) untuk semua.
*   Kontras warna memenuhi WCAG AA, termasuk di dark mode. Fokus keyboard harus terlihat jelas.
*   Hormati `prefers-reduced-motion`.

## 8. PWA
*   `manifest.ts` lengkap: name, short_name, `display: "standalone"`, theme_color, background_color, icon 192 dan 512 plus maskable.
*   Service worker untuk cache app shell supaya bisa dibuka offline (data sudah lokal di localStorage).
*   Tes installable lewat Lighthouse sebelum fase dianggap selesai.

## 9. Perintah Project
*   `npm run dev` : dev server di localhost:3000
*   `npm run build` : validasi build produksi (wajib lolos)
*   `npm run start` : jalankan hasil build
*   `npm run lint` : ESLint (wajib lolos)
*   `npx tsc --noEmit` : cek tipe (wajib lolos)

## 10. Definition of Done (per fitur)
1.  `lint`, `tsc`, dan `build` lolos tanpa error.
2.  Dicek di lebar 360px, 768px, dan 1280px. Tidak ada layout pecah atau overflow.
3.  Tidak ada error hydration di console.
4.  Data tetap ada setelah reload.
5.  Empty state, loading state, dan error state sudah ditangani.

## 11. Out of Scope
*   Tidak ada database server, auth provider, atau sync real-time antar device.
*   localStorage adalah satu-satunya lapisan data. Konflik edit antar device tidak ditangani (gunakan export/import untuk pindah data).
*   Jangan tambah dependency berat kalau bisa dengan Tailwind atau API browser. Library kecil yang jelas gunanya (misal `@dnd-kit` untuk drag-and-drop di Fase 3) boleh, sebutkan alasannya di PR atau commit.

## 12. Cara Kerja Agent
*   Kerjakan satu fase sekali jalan, jangan lompat. Selesaikan dan verifikasi Fase 1 sebelum Fase 2.
*   Sebelum mengubah struktur data, update bagian 4 dan tambahkan migrasi.
*   Kalau ada keputusan desain yang ambigu, pilih yang paling sederhana dan catat asumsinya.
