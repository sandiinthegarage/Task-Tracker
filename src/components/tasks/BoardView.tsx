"use client";

import { Task } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import SubtaskList from "./SubtaskList";

interface BoardViewProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function BoardView({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
}: BoardViewProps) {
  const columns: Array<"todo" | "doing" | "done"> = ["todo", "doing", "done"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col);
        return (
          <div
            key={col}
            className="border-3 border-fg p-3 md:p-4 bg-gray-50 min-h-[400px]"
          >
            <h3 className="text-lg font-bold uppercase mb-3 pb-2 border-b-3 border-fg">
              {STATUS_LABELS[col]}
            </h3>
            <div className="space-y-3">
              {colTasks.length === 0 ? (
                <div className="border-3 border-dashed border-fg/30 py-6 text-center">
                  <p className="text-sm font-bold text-gray-500">Kosong</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border-2 border-fg p-3 shadow-brutal-sm space-y-2"
                  >
                    <h4 className="font-bold text-sm uppercase line-clamp-2">
                      {task.title}
                    </h4>
                    {task.notes && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {task.notes}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "danger"
                            : task.priority === "medium"
                              ? "warning"
                              : "primary"
                        }
                      >
                        {task.priority}
                      </Badge>
                      {task.deadline && (
                        <span className="text-xs font-bold text-gray-600 px-2 py-1 border-2 border-fg bg-gray-100">
                          {new Date(task.deadline).toLocaleDateString("id-ID", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    {task.subtasks.length > 0 && (
                      <div className="pt-2 border-t-2 border-fg">
                        <SubtaskList task={task} compact />
                      </div>
                    )}
                    <div className="flex gap-1 pt-2">
                      <button
                        onClick={() => onEdit(task)}
                        className="flex-1 text-xs font-bold px-2 py-1 bg-accent text-fg border-2 border-fg shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="flex-1 text-xs font-bold px-2 py-1 bg-danger text-white border-2 border-fg shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
