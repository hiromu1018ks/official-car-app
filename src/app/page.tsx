"use client";

import { useEffect, useState } from "react";
import type { Vehicle } from "@/types/vehicle.ts";
import { HomeContent } from "./components/HomeContent.tsx";
import { ReservationCalendar } from "./components/ReservationCalendar.tsx";
import { VehicleTable } from "./components/VehicleTable.tsx";

interface VehicleStats {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const [vehiclesRes, statsRes] = await Promise.all([
          fetch("/api/vehicles"),
          fetch("/api/stats"),
        ]);

        const vehiclesData = (await vehiclesRes.json()) as Vehicle[];
        const statsData = (await statsRes.json()) as VehicleStats;

        setVehicles(vehiclesData);
        setStats(statsData);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchDate();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  if (!stats) return <div>エラーが発生しました</div>;

  const { total, available, inUse, maintenance } = stats;

  return (
    <>
      <HomeContent
        total={total}
        available={available}
        inUse={inUse}
        maintenance={maintenance}
        vehicles={vehicles}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <VehicleTable />
        <ReservationCalendar />
      </main>
    </>
  );
}
