import { Task, StorageData, SCHEMA_VERSION, STORAGE_KEY } from "@/lib/types";
import { sortTasks } from "@/lib/date";

export function validateImport(data: unknown): data is StorageData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (
    typeof obj.schemaVersion !== "number" ||
    obj.schemaVersion !== SCHEMA_VERSION
  ) {
    return false;
  }
  if (!Array.isArray(obj.tasks)) return false;
  return true;
}

export function exportTasks(tasks: Task[]): string {
  const data: StorageData = {
    schemaVersion: SCHEMA_VERSION,
    tasks: sortTasks(tasks),
  };
  return JSON.stringify(data, null, 2);
}

export function importTasks(jsonString: string): Task[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (!validateImport(parsed)) {
      throw new Error("Format data tidak valid atau versi schema tidak cocok");
    }
    return sortTasks(parsed.tasks);
  } catch (err) {
    throw new Error(`Gagal import: ${err instanceof Error ? err.message : "Format JSON salah"}`);
  }
}

export function downloadJSON(tasks: Task[], filename: string = "tasks-backup.json") {
  const json = exportTasks(tasks);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function uploadJSON(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = typeof reader.result === "string" ? reader.result : "";
        const tasks = importTasks(json);
        resolve(tasks);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => {
      reject(new Error("Gagal membaca file"));
    };
    reader.readAsText(file);
  });
}
