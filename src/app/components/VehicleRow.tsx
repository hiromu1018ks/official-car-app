import { Button } from "@/components/ui/button.tsx";
import { statusConfig } from "@/data/vehicles.ts";
import type { Vehicle } from "@/types/vehicle.ts";

interface VehicleRowProps {
  vehicle: Vehicle;
}

export const VehicleRow = ({ vehicle }: VehicleRowProps) => {
  const IconComponent = vehicle.icon;
  const status = statusConfig[vehicle.status];

  return (
    <tr className="hover:bg-white/80 transition-all duration-200">
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            <div
              className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${vehicle.iconColorFrom} ${vehicle.iconColorTo} flex items-center justify-center shadow-lg`}
            >
              <IconComponent className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="ml-6">
            <div className="text-sm font-bold text-gray-900">
              {vehicle.licensePlate}
            </div>
            <div className="text-sm text-gray-600">
              {vehicle.make} {vehicle.model} ({vehicle.year}年)
            </div>
          </div>
        </div>
      </td>

      {/* ステータス列 */}
      <td className="px-8 py-6 whitespace-nowrap">
        <span
          className={`inline-flex px-3 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r ${status.bgGradient} ${status.textColor} shadow-sm`}
        >
          {status.label}
        </span>
      </td>

      {/* 現在の利用者列 */}
      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
        {vehicle.currentUser || "-"}
      </td>

      {/* 次回点検日列 */}
      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
        {vehicle.nextInspection}
      </td>

      {/* 操作列 */}
      <td className="px-8 py-6 whitespace-nowrap text-sm font-medium space-x-3">
        <Button
          className={`px-4 py-2 rounded-xl transition-all shadow-md ${
            status.buttonDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white hover:shadow-lg transform hover:scale-105"
          }`}
          disabled={status.buttonDisabled}
        >
          予約
        </Button>
        <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg">
          詳細
        </Button>
      </td>
    </tr>
  );
};
