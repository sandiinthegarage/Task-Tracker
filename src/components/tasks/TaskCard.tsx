"use client";

import { Task } from "@/lib/types";
import { formatDeadline, isOverdue, calculateSubtaskProgress } from "@/lib/date";
import { STATUS_LABELS, STATUS_BADGE, PRIORITY_COLORS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import SubtaskList from "./SubtaskList";

interface TaskCardProps {
  task: Task;
  onToggleStatus: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export default function TaskCard({
  task,
  onToggleStatus,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const progress = calculateSubtaskProgress(task.subtasks);
  const deadlineText = task.deadline ? formatDeadline(task.deadline) : null;
  const isOver = task.deadline && isOverdue(task.deadline);

  return (
    <div className="border-3 border-fg p-4 bg-bg shadow-brutal rounded-none">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1">
          <h3 className="text-lg font-bold uppercase">{task.title}</h3>
          {task.notes && <p className="text-sm text-gray-600 mt-1">{task.notes}</p>}
        </div>
        <button
          onClick={onToggleStatus}
          className={`px-2 py-1 text-xs font-bold border-2 border-fg rounded-none ${STATUS_BADGE[task.status]} min-w-fit`}
        >
          {STATUS_LABELS[task.status]}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {task.category && (
          <Badge variant="primary">{task.category}</Badge>
        )}
        <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "primary"}>
          {task.priority}
        </Badge>
        {isOver && <Badge variant="danger">Terlambat</Badge>}
      </div>

      {task.subtasks.length > 0 && (
        <div className="mb-3 pb-3 border-b-2 border-fg">
          <div className="mb-2">
            <div className="w-full bg-gray-200 border-2 border-fg h-4 rounded-none">
              <div
                className="bg-success h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs font-bold mt-1">{progress}% selesai</p>
          </div>
          <SubtaskList task={task} />
        </div>
      )}

      <div className="flex items-center justify-between text-sm font-bold mb-3">
        {deadlineText && (
          <span className={isOver ? "text-danger" : ""}>
            {deadlineText}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-2 py-2 bg-accent text-fg border-2 border-fg font-bold shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-2 py-2 bg-danger text-white border-2 border-fg font-bold shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
