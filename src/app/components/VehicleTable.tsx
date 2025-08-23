"use client";

import { useEffect, useState } from "react";
import type { Vehicle } from "@/types/vehicle.ts";
import { VehicleRow } from "./VehicleRow.tsx";

/**
 * 車両一覧テーブルコンポーネント
 * - /api/vehicles から車両データを取得し、テーブル表示
 * - 読み込み中はローディング表示
 */
export const VehicleTable = () => {
  // 車両データの状態管理
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // ローディング状態管理
  const [loading, setLoading] = useState(true);

  // 初回マウント時に車両データを取得
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // APIから車両データを取得
        const response = await fetch("/api/vehicles");
        const data = (await response.json()) as Vehicle[];
        setVehicles(data);
      } finally {
        setLoading(false);
      }
    };
    // 非同期関数の呼び出し（警告回避のためvoidを付与）
    void fetchVehicles();
  }, []);

  // ローディング中の表示
  if (loading) return <div>読み込み中...</div>;

  return (
    // テーブル全体のラッパー（デザイン用のクラスを適用）
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* ヘッダー部分 */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-xl font-bold gradient-text">車両一覧</h2>
      </div>
      {/* テーブル本体（横スクロール対応） */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          {/* テーブルヘッダー */}
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
          {/* テーブルボディ（車両ごとにVehicleRowを描画） */}
          <tbody className="bg-white/50 divide-y divide-gray-100">
            {vehicles.map((vehicle) => (
              // 各車両の行コンポーネント
              <VehicleRow key={vehicle.id} vehicle={vehicle} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
