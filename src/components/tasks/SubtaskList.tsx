"use client";

import { Task } from "@/lib/types";
import { useTaskStorage } from "@/hooks/useTaskStorage";
import { useState } from "react";

interface SubtaskListProps {
  task: Task;
  compact?: boolean;
}

export default function SubtaskList({ task, compact }: SubtaskListProps) {
  const { toggleSubtask, deleteSubtask, addSubtask } = useTaskStorage();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle("");
    }
  };

  if (compact) {
    return (
      <div className="space-y-1 text-xs">
        {task.subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={subtask.done}
              onChange={() => toggleSubtask(task.id, subtask.id)}
              className="w-3 h-3 cursor-pointer"
            />
            <span
              className={subtask.done ? "line-through text-gray-400" : ""}
            >
              {subtask.title}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {task.subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-2 p-2 border-2 border-fg bg-gray-50 rounded-none"
          >
            <input
              type="checkbox"
              checked={subtask.done}
              onChange={() => toggleSubtask(task.id, subtask.id)}
              className="w-5 h-5 cursor-pointer"
            />
            <span
              className={`flex-1 font-bold ${
                subtask.done ? "line-through text-gray-400" : ""
              }`}
            >
              {subtask.title}
            </span>
            <button
              onClick={() => deleteSubtask(task.id, subtask.id)}
              className="text-xs font-bold px-2 py-1 bg-danger text-white border-2 border-fg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddSubtask} className="flex gap-2">
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="+ Tambah subtask"
          className="flex-1 border-2 border-fg p-2 text-sm font-bold rounded-none focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newSubtaskTitle.trim()}
          className="px-2 py-1 bg-fg text-bg font-bold border-2 border-fg text-sm disabled:opacity-50"
        >
          +
        </button>
      </form>
    </div>
  );
}
