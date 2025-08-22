"use client";

import { useState } from "react";
import { Car, CheckCircle, Wrench, XCircle } from "lucide-react";
import type { ServerActionResult } from "@/types/reservation.ts";
import type { Vehicle } from "@/types/vehicle";
import { DrivingLogSection } from "./DrivingLogSection.tsx";
import { Header } from "./Header.tsx";
import { ReservationModal } from "./ReservationModal.tsx";
import { StatsCard } from "./StatsCard.tsx";

interface HomeContentProps {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  vehicles: Vehicle[];
  onReservationSubmit: (
    formData: FormData,
    userId: string
  ) => Promise<ServerActionResult>;
}

export function HomeContent({
  total,
  available,
  inUse,
  maintenance,
  vehicles,
  onReservationSubmit,
}: HomeContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statsData = [
    {
      title: "総車両数",
      value: total,
      unit: "台",
      icon: Car,
      colorScheme: "purple" as const,
    },
    {
      title: "利用可能",
      value: available,
      unit: "台",
      icon: CheckCircle,
      colorScheme: "cyan" as const,
    },
    {
      title: "点検中",
      value: maintenance,
      unit: "台",
      icon: Wrench,
      colorScheme: "orange" as const,
    },
    {
      title: "使用中",
      value: inUse,
      unit: "台",
      icon: XCircle,
      colorScheme: "pink" as const,
    },
  ];

  return (
    <>
      <Header onReservationClick={() => setIsModalOpen(true)} />
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
      </main>

      <ReservationModal
        vehicles={vehicles}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onReservationSubmit}
      />
    </>
  );
}
