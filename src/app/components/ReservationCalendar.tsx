"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useReservations } from "@/lib/hooks/useReservations.ts";

interface ReservationWithDetails {
  id: string;
  start_time: string;
  end_time: string;
  destination: string | null;
  status: string;
  vehicle: {
    make: string;
    model: string;
    license_plate: string;
    icon: string;
    icon_color_from: string;
    icon_color_to: string;
  };
  user: {
    name: string;
    email: string;
  };
}

const getWeekDays = (date: Date): Date[] => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(start);
    weekDay.setDate(start.getDate() + i);
    weekDays.push(weekDay);
  }

  return weekDays;
};

const getReservationsForDay = (
  reservations: ReservationWithDetails[],
  targetDate: Date
) => {
  return reservations.filter((reservation) => {
    const startDate = new Date(reservation.start_time);

    return startDate.toDateString() === targetDate.toDateString();
  });
};

export function ReservationCalendar() {
  const { reservations, loading, error } = useReservations();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (loading) return <div className="p-4">Loading...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const weekDays = getWeekDays(currentDate);

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const handleReservationClick = (reservation: ReservationWithDetails) => {
    console.log("予約詳細:", reservation);
  };

  const handleReservationKeyDown = (
    e: React.KeyboardEvent,
    reservation: ReservationWithDetails
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleReservationClick(reservation);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">予約カレンダー</h2>
        <div className="flex gap-2">
          <Button
            onClick={handlePrevWeek}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            ← 前週
          </Button>
          <Button
            onClick={handleNextWeek}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            次週 →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div key={day} className="p-2 text-center font-medium bg-gray-100">
            {day}
          </div>
        ))}

        {weekDays.map((day) => {
          const dayReservations = getReservationsForDay(reservations, day);

          return (
            <div key={day.toISOString()} className="min-h-[120px] p-2 border">
              <div className="text-sm font-medium mb-2">{day.getDate()}</div>
              {dayReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  role="button"
                  tabIndex={0}
                  className="p-1 mb-1 text-xs bg-blue-100 rounded cursor-pointer hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleReservationClick(reservation)}
                  onKeyDown={(e) => handleReservationKeyDown(e, reservation)}
                >
                  <div>
                    {reservation.vehicle.make} {reservation.vehicle.model}
                  </div>
                  <div>
                    {new Date(reservation.start_time).toLocaleTimeString(
                      "ja-JP",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
