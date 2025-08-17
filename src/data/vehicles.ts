import { Car, CarFront, Truck } from "lucide-react";
import type { StatusConfig, Vehicle } from "../types/vehicle.ts";

// ステータス設定（デザイン案のスタイル通り）
export const statusConfig: Record<string, StatusConfig> = {
  available: {
    label: "利用可能",
    bgGradient: "from-emerald-100 to-green-100",
    textColor: "text-emerald-700",
    buttonDisabled: false,
  },
  "in-use": {
    label: "使用中",
    bgGradient: "from-red-100 to-pink-100",
    textColor: "text-red-700",
    buttonDisabled: true,
  },
  maintenance: {
    label: "点検中",
    bgGradient: "from-amber-100 to-orange-100",
    textColor: "text-amber-700",
    buttonDisabled: true,
  },
};

// サンプル車両データ（デザイン案の3台を再現）
export const vehicles: Vehicle[] = [
  {
    id: "1",
    licensePlate: "品川 500 あ 1234",
    make: "トヨタ",
    model: "プリウス",
    year: 2022,
    status: "available",
    currentUser: undefined,
    nextInspection: "2024/03/15",
    icon: Car,
    iconColorFrom: "blue-500",
    iconColorTo: "purple-600",
  },
  {
    id: "2",
    licensePlate: "品川 500 か 5678",
    make: "日産",
    model: "セレナ",
    year: 2021,
    status: "in-use",
    currentUser: "佐藤花子",
    nextInspection: "2024/04/20",
    icon: Truck,
    iconColorFrom: "indigo-500",
    iconColorTo: "blue-600",
  },
  {
    id: "3",
    licensePlate: "品川 500 さ 9012",
    make: "ホンダ",
    model: "フリード",
    year: 2020,
    status: "maintenance",
    currentUser: undefined,
    nextInspection: "2024/02/28",
    icon: CarFront,
    iconColorFrom: "green-500",
    iconColorTo: "teal-600",
  },
];
