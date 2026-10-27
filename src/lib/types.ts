export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "doing" | "done";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: Status;
  priority: Priority;
  category?: string;
  deadline?: string;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface StorageData {
  schemaVersion: number;
  tasks: Task[];
}

export const STORAGE_KEY = "taskTracker:v1";
export const SCHEMA_VERSION = 1;

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "border-blue-500 bg-blue-50 text-blue-900",
  medium: "border-yellow-500 bg-yellow-50 text-yellow-900",
  high: "border-danger bg-red-50 text-red-900",
};

export const STATUS_LABELS: Record<Status, string> = {
  todo: "Akan Dikerjakan",
  doing: "Sedang Dikerjakan",
  done: "Selesai",
};

export const STATUS_BADGE: Record<Status, string> = {
  todo: "bg-white border-fg text-fg",
  doing: "bg-yellow-100 border-yellow-600 text-yellow-900",
  done: "bg-success text-white border-success",
};
