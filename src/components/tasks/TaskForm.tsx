"use client";

import { Task, Priority } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">) => void;
  onCancel: () => void;
}

export default function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;
    const priority = formData.get("priority") as Priority;
    const category = formData.get("category") as string;
    const deadline = formData.get("deadline") as string;

    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      category: category.trim() || undefined,
      deadline: deadline || undefined,
      status: initialTask?.status || "todo",
      subtasks: initialTask?.subtasks || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-bold mb-2">Judul *</label>
        <input
          type="text"
          name="title"
          defaultValue={initialTask?.title || ""}
          placeholder="Apa yang perlu dikerjakan?"
          className="w-full border-3 border-fg p-3 font-bold text-base rounded-none focus:outline-none focus:shadow-brutal"
          required
          maxLength={120}
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Catatan</label>
        <textarea
          name="notes"
          defaultValue={initialTask?.notes || ""}
          placeholder="Tambahkan detail..."
          className="w-full border-3 border-fg p-3 font-bold text-base rounded-none focus:outline-none focus:shadow-brutal min-h-[100px]"
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold mb-2">Prioritas</label>
          <select
            name="priority"
            defaultValue={initialTask?.priority || "medium"}
            className="w-full border-3 border-fg p-3 font-bold text-base rounded-none focus:outline-none focus:shadow-brutal"
          >
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </div>

        <div>
          <label className="block font-bold mb-2">Kategori</label>
          <input
            type="text"
            name="category"
            defaultValue={initialTask?.category || ""}
            placeholder="Kuliah, Proyek..."
            className="w-full border-3 border-fg p-3 font-bold text-base rounded-none focus:outline-none focus:shadow-brutal"
            maxLength={30}
          />
        </div>
      </div>

      <div>
        <label className="block font-bold mb-2">Deadline</label>
        <input
          type="date"
          name="deadline"
          defaultValue={initialTask?.deadline || ""}
          className="w-full border-3 border-fg p-3 font-bold text-base rounded-none focus:outline-none focus:shadow-brutal"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="primary" type="submit" className="flex-1">
          {initialTask ? "Perbarui" : "Tambah"} Task
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel} className="flex-1">
          Batal
        </Button>
      </div>
    </form>
  );
}
