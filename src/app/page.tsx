import { Car, CheckCircle, Wrench, XCircle } from "lucide-react";
import { StatsCard } from "./components/StatsCard";

export default function Home() {
  const statsData = [
    {
      title: "総車両数",
      value: 12,
      unit: "台",
      icon: Car,
      colorScheme: "blue" as const,
    },
    {
      title: "利用可能",
      value: 8,
      unit: "台",
      icon: CheckCircle,
      colorScheme: "green" as const,
    },
    {
      title: "点検中",
      value: 2,
      unit: "台",
      icon: Wrench,
      colorScheme: "amber" as const,
    },
    {
      title: "使用中",
      value: 2,
      unit: "台",
      icon: XCircle,
      colorScheme: "red" as const,
    },
  ];
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            unit={stat.unit}
            icon={stat.icon}
            colorScheme={stat.colorScheme}
          />
        ))}
      </div>
    </main>
  );
}
