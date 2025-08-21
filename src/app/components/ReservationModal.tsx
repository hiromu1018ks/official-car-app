"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { reservationSchema } from "@/lib/schemas/reservation.ts";
import type { Vehicle } from "@/types/vehicle.ts";

interface ReservationModalProps {
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({
  vehicles,
  isOpen,
  onClose,
}: ReservationModalProps) {
  const form = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      vehicleId: "",
      startDateTime: "",
      endDateTime: "",
      destination: "",
    },
  });

  return (
    isOpen && (
      <div
        id="modal"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm items-center justify-center z-50"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full mx-4 border border-white/20">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-xl font-bold gradient-text">車両を予約する</h3>
          </div>
          <div className="px-8 py-6 space-y-6">
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                車両を選択
              </Label>
              <select
                {...form.register("vehicleId")}
                className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
              >
                <option value="">選択してください</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                利用開始日時
              </Label>
              <Input
                {...form.register("startDateTime")}
                type="datetime-local"
                className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                利用終了日時
              </Label>
              <Input
                {...form.register("endDateTime")}
                type="datetime-local"
                className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                利用目的
              </Label>
              <Textarea
                {...form.register("destination")}
                placeholder="出張、会議、その他の業務など..."
                className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm h-24 resize-none"
              ></Textarea>
            </div>
          </div>
          <div className="px-8 py-6 border-t border-gray-100 flex justify-end space-x-4">
            <Button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all shadow-md"
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                alert("予約確定");
              }}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              予約を確定する
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
