import { Button } from "@/components/ui/button.tsx";
import type { InUseVehicle } from "@/types/vehicle.ts";

interface InUseVehicleCardProps {
  vehicle: InUseVehicle;
}

export const InUseVehicleCard = ({ vehicle }: InUseVehicleCardProps) => {
  const IconComponent = vehicle.icon;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        {/* 左側: 車両情報 */}
        <div className="flex items-center space-x-3">
          {/* 車両アイコン */}
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <IconComponent className="text-white w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-bold">{vehicle.licensePlate}</div>
            <div className="text-purple-100 text-sm">
              {vehicle.make} {vehicle.model}
            </div>
          </div>
        </div>
        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
          使用中
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-purple-100">利用者:</span>
          <span className="text-white font-medium">{vehicle.currentUser}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-purple-100">開始時刻:</span>
          <span className="text-white font-medium">{vehicle.startTime}</span>
        </div>
      </div>
      <Button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-xl transition-all backdrop-blur-sm border border-white/20 hover:border-white/40">
        運転日誌を入力
      </Button>
    </div>
  );
};
