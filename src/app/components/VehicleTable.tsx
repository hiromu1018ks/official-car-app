"use client";

import { vehicles } from "@/data/vehicles.ts";

export const VehicleTable = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-xl font-bold gradient-text">車両一覧</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                車両情報
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                現在の利用者
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                次回点検日
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-100">
            {vehicles.map((vehice) => (
              <tr
                key={vehice.id}
                className="hover:bg-white/80 transition-all duration-200"
              >
                <td colSpan={5} className="px-8 py-6 text-center text-gray-500">
                  VehicleRowコンポーネントをここに配置予定
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
