"use client";

import { Task } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface StatsCardsProps {
  total: number;
  doneToday: number;
  overdue: number;
  weeklyProgress: number;
}

export default function StatsCards({
  total,
  doneToday,
  overdue,
  weeklyProgress,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
      <StatCard
        label="Total Task"
        value={total}
        icon="📋"
        color="bg-fg text-bg"
      />
      <StatCard
        label="Selesai Hari Ini"
        value={doneToday}
        icon="✅"
        color="bg-success text-white"
      />
      <StatCard
        label="Terlambat"
        value={overdue}
        icon="⏰"
        color="bg-danger text-white"
      />
      <StatCard
        label="Progres Mingguan"
        value={`${weeklyProgress}%`}
        icon="📈"
        color="bg-warning text-black"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: React.ReactNode;
  icon: string;
  color: string;
}) {
  return (
    <div className={`border-3 border-fg p-3 md:p-4 ${color} shadow-brutal rounded-none min-h-[72px] md:min-h-[88px]`}>
      <div className="text-2xl md:text-4xl font-bold mb-1">{value}</div>
      <div className="flex items-center gap-1 mb-1 flex-wrap">
        <span>{icon}</span>
        <span className="text-xs md:text-sm font-bold opacity-90 leading-tight">{label}</span>
      </div>
    </div>
  );
}
