"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, StorageData, STORAGE_KEY, SCHEMA_VERSION } from "@/lib/types";
import { sortTasks, generateId } from "@/lib/date";

export function useTaskStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadTasks = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: StorageData = JSON.parse(stored);
          if (data.schemaVersion === SCHEMA_VERSION) {
            setTasks(sortTasks(data.tasks));
          }
        } else {
          setTasks([]);
        }
      } catch {
        console.error("Failed to load tasks");
        setTasks([]);
      }
      setIsHydrated(true);
    };

    loadTasks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const data: StorageData = JSON.parse(e.newValue);
          setTasks(sortTasks(data.tasks));
        } catch {
          console.error("Failed to sync tasks from storage event");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveTasks = useCallback((newTasks: Task[]) => {
    const sorted = sortTasks(newTasks);
    setTasks(sorted);
    if (typeof window !== "undefined") {
      const data: StorageData = {
        schemaVersion: SCHEMA_VERSION,
        tasks: sorted,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, []);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        subtasks: task.subtasks || [],
      };
      saveTasks([...tasks, newTask]);
    },
    [tasks, saveTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      const now = new Date().toISOString();
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: now } : t
      );
      saveTasks(updated);
    },
    [tasks, saveTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      saveTasks(tasks.filter((t) => t.id !== id));
    },
    [tasks, saveTasks]
  );

  const toggleTaskStatus = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const statusOrder: Array<Task["status"]> = ["todo", "doing", "done"];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      updateTask(id, {
        status: nextStatus,
        completedAt:
          nextStatus === "done" ? new Date().toISOString() : undefined,
      });
    },
    [tasks, updateTask]
  );

  const addSubtask = useCallback(
    (taskId: string, title: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const newSubtask = {
        id: generateId(),
        title,
        done: false,
      };
      updateTask(taskId, {
        subtasks: [...task.subtasks, newSubtask],
      });
    },
    [tasks, updateTask]
  );

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const updated = task.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, done: !s.done } : s
      );
      updateTask(taskId, { subtasks: updated });
    },
    [tasks, updateTask]
  );

  const deleteSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      updateTask(taskId, {
        subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
      });
    },
    [tasks, updateTask]
  );

  return {
    tasks,
    isHydrated,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };
}
