"use client";

import { Car, CheckCircle, Wrench, XCircle } from "lucide-react";
import { DrivingLogSection } from "./components/DrivingLogSection.tsx";
import { StatsCard } from "./components/StatsCard.tsx";
import { VehicleTable } from "./components/VehicleTable.tsx";

export default function Home() {
  const statsData = [
    {
      title: "総車両数",
      value: 12,
      unit: "台",
      icon: Car,
      colorScheme: "purple" as const,
    },
    {
      title: "利用可能",
      value: 8,
      unit: "台",
      icon: CheckCircle,
      colorScheme: "cyan" as const,
    },
    {
      title: "点検中",
      value: 2,
      unit: "台",
      icon: Wrench,
      colorScheme: "orange" as const,
    },
    {
      title: "使用中",
      value: 2,
      unit: "台",
      icon: XCircle,
      colorScheme: "pink" as const,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DrivingLogSection />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            unit={stat.unit}
            icon={stat.icon}
            colorScheme={stat.colorScheme}
          />
        ))}
      </div>
      {/* 車両一覧テーブル */}
      <VehicleTable />
    </main>
  );
}
