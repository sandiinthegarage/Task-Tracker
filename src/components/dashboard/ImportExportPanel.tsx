"use client";

import { useState, useRef } from "react";
import { useTaskStorage } from "@/hooks/useTaskStorage";
import { downloadJSON, uploadJSON, validateImport } from "@/lib/export";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export default function ImportExportPanel() {
  const { tasks, addTask } = useTaskStorage();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      downloadJSON(
        tasks,
        `tasks-${new Date().toISOString().split("T")[0]}.json`
      );
      setToastMessage("✅ Data diexport berhasil");
      setShowToast(true);
    } catch {
      setToastMessage("❌ Export gagal");
      setShowToast(true);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedTasks = await uploadJSON(file);
      importedTasks.forEach((task) => {
        addTask(task);
      });
      setToastMessage(`✅ ${importedTasks.length} task diimport`);
      setShowToast(true);
    } catch (err) {
      setToastMessage(
        `❌ Import gagal: ${err instanceof Error ? err.message : "Kesalahan tidak diketahui"}`
      );
      setShowToast(true);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="border-3 border-fg p-4 md:p-6 bg-gray-50 shadow-brutal space-y-4">
      <h3 className="text-lg font-bold uppercase">Backup & Restore</h3>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleExport} variant="primary" size="md">
          📥 Export
        </Button>
        <Button onClick={handleImportClick} variant="secondary" size="md">
          📤 Import
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Import JSON file"
      />

      <p className="text-xs text-gray-600">
        Export untuk backup data. Import dari file JSON untuk restore atau migrasi.
      </p>

      {showToast && (
        <Toast message={toastMessage} onClose={handleCloseToast} />
      )}
    </div>
  );
}
