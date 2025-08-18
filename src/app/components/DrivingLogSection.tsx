import { FileText } from "lucide-react";
import { getDrivingLogStats, getInUseVehicles } from "@/lib/data.ts";
import { InUseVehicleCard } from "./InUseVehicleCard.tsx";

export const DrivingLogSection = async () => {
  const { inUseVehicles: inUse, todayLog } = await getDrivingLogStats();
  const inUseVehicles = await getInUseVehicles();

  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        {/* 左側: タイトルと説明 */}
        <div className="mb-6 lg:mb-0 lg:mr-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">運転日誌</h2>
              <p className="text-purple-100 text-sm">
                現在使用中の車両の運転記録を管理
              </p>
            </div>
          </div>
        </div>

        {/* 右側: 統計表示（デスクトップのみ） */}
        <div className="hidden lg:flex lg:space-x-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{inUse}</div>
            <div className="text-sm text-purple-100">使用中車両</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{todayLog}</div>
            <div className="text-sm text-purple-100">今日の記録</div>
          </div>
        </div>
      </div>

      {/* 使用中車両カード一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {inUseVehicles.map((vehicle) => (
          <InUseVehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
};
