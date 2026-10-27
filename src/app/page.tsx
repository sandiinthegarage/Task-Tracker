"use client";

import { useState } from "react";
import { useTaskStorage } from "@/hooks/useTaskStorage";
import { Task } from "@/lib/types";
import { isOverdue } from "@/lib/date";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import StatsCards from "@/components/dashboard/StatsCards";
import FilterBar from "@/components/dashboard/FilterBar";
import BoardView from "@/components/tasks/BoardView";
import ImportExportPanel from "@/components/dashboard/ImportExportPanel";

export default function Home() {
  const { tasks, isHydrated, addTask, updateTask, deleteTask, toggleTaskStatus } =
    useTaskStorage();

  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [lastDeleted, setLastDeleted] = useState<Task | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!isHydrated) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <LoadingSkeleton />
      </main>
    );
  }

  const visibleTasks = tasks.filter((t) => {
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (
        !t.title.toLowerCase().includes(kw) &&
        !(t.notes || "").toLowerCase().includes(kw) &&
        !(t.category || "").toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    return true;
  });

  const doneToday = visibleTasks.filter((t) => {
    if (t.status !== "done" || !t.deadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dl = new Date(t.deadline);
    dl.setHours(0, 0, 0, 0);
    return dl.getTime() === today.getTime();
  }).length;

  const overdueCount = visibleTasks.filter(
    (t) => t.deadline && isOverdue(t.deadline)
  ).length;

  const weeklyProgress =
    visibleTasks.length > 0
      ? Math.round(
          (visibleTasks.filter((t) => t.status === "done").length /
            Math.max(
              visibleTasks.filter((t) => t.status !== "todo").length || 1
            )) *
            100
        )
      : 0;

  const handleAddTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">
  ) => {
    addTask(taskData);
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setShowForm(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (task: Task) => {
    deleteTask(task.id);
    setLastDeleted(task);
    setShowToast(true);
  };

  const handleUndo = () => {
    if (lastDeleted) {
      addTask(lastDeleted);
      setLastDeleted(null);
      setShowToast(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleCloseToast = () => {
    setShowToast(false);
    setTimeout(() => setLastDeleted(null), 300);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b-3 border-fg bg-fg text-bg p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest flex-1">
              TASK TRACKER
            </h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3 py-2 bg-accent text-fg font-bold border-2 border-bg rounded-none shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none min-h-[44px]"
              aria-label="Settings"
            >
              ⚙️
            </button>
          </div>
          <div className="flex gap-2 md:gap-3 justify-center md:justify-start">
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 md:flex-none px-3 py-2 text-sm font-bold border-2 rounded-none transition-all ${
                viewMode === "list"
                  ? "bg-accent text-fg shadow-brutal"
                  : "border-bg bg-fg text-bg"
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`flex-1 md:flex-none px-3 py-2 text-sm font-bold border-2 rounded-none transition-all ${
                viewMode === "board"
                  ? "bg-accent text-fg shadow-brutal"
                  : "border-bg bg-fg text-bg"
              }`}
            >
              📊 Board
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 pb-28 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 w-full">
          {showSettings ? (
            <ImportExportPanel />
          ) : showForm ? (
            <div className="border-3 border-fg p-4 md:p-6 bg-gray-50 shadow-brutal">
              <h2 className="text-xl font-bold mb-4 uppercase">
                {editingTask ? "Edit Task" : "Tambah Task"}
              </h2>
              <TaskForm
                initialTask={editingTask || undefined}
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <>
              <FilterBar
                keyword={keyword}
                onSearch={setKeyword}
                onFilter={(filters) => {
                  if (filters.status !== undefined) setStatusFilter(filters.status);
                  if (filters.priority !== undefined)
                    setPriorityFilter(filters.priority);
                }}
                allCategories={tasks.map((t) => t.category || "").filter(Boolean)}
              />

              <StatsCards
                total={visibleTasks.length}
                doneToday={doneToday}
                overdue={overdueCount}
                weeklyProgress={weeklyProgress}
              />

              {visibleTasks.length === 0 ? (
                <EmptyState
                  icon="📝"
                  title="Tidak ada task"
                  message={
                    keyword || statusFilter || priorityFilter
                      ? "Coba ubah pencarian atau filter"
                      : "Mulai dengan menambah task baru"
                  }
                />
              ) : viewMode === "list" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {visibleTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleStatus={() => toggleTaskStatus(task.id)}
                      onDelete={() => handleDeleteTask(task)}
                      onEdit={() => handleEditTask(task)}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                  <div className="min-w-full">
                    <BoardView
                      tasks={visibleTasks}
                      onToggleStatus={toggleTaskStatus}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {!showForm && !showSettings && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTask(null);
          }}
          className="fixed right-4 w-14 h-14 md:w-16 md:h-16 bg-accent text-fg font-bold text-2xl md:text-3xl border-3 border-fg shadow-brutal-lg rounded-none flex items-center justify-center active:translate-x-1 active:translate-y-1 active:shadow-brutal z-30 min-h-[44px] min-w-[44px]"
          style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          aria-label="Tambah task"
        >
          +
        </button>
      )}

      {showToast && lastDeleted && (
        <Toast
          message="Task dihapus"
          action={{
            label: "Urungkan",
            onClick: handleUndo,
          }}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
}
