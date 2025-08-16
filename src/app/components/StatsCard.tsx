import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  colorScheme: "blue" | "green" | "amber" | "red";
}

export const StatsCard = ({
  title,
  value,
  unit,
  icon: Icon,
  colorScheme,
}: StatsCardProps) => {
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 card-hover">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colorClasses[colorScheme].icon} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="text-white text-xl" />
          </div>
        </div>
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
