import type { LucideIcon } from "lucide-react";

// StatsCardコンポーネントのprops型定義
interface StatsCardProps {
  title: string; // カードのタイトル
  value: number; // 表示する数値
  unit: string; // 単位（例: km, 件 など）
  icon: LucideIcon; // 表示するアイコンコンポーネント
  colorScheme: "blue" | "green" | "amber" | "red"; // カラースキーム
}

// 統計情報を表示するカードコンポーネント
export const StatsCard = ({
  title,
  value,
  unit,
  icon: Icon,
  colorScheme,
}: StatsCardProps) => {
  // カラースキームごとのクラス定義
  const colorClasses = {
    blue: {
      icon: "from-blue-500 to-blue-600",
      text: "gradient-text", // CSSで定義済み
    },
    green: {
      icon: "from-emerald-500 to-green-600",
      text: "text-emerald-600",
    },
    amber: {
      icon: "from-amber-500 to-orange-600",
      text: "text-amber-600",
    },
    red: {
      icon: "from-red-500 to-pink-600",
      text: "text-red-600",
    },
  };

  return (
    // ガラス風エフェクトとホバー効果付きのカード
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 card-hover">
      <div className="flex items-center">
        {/* アイコン部分 */}
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colorClasses[colorScheme].icon} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="text-white text-xl" />
          </div>
        </div>
        {/* タイトルと値部分 */}
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[colorScheme].text}`}>
            {value}
            {unit}
          </p>
        </div>
      </div>
    </div>
  );
};
