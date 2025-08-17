import { Car, CarFront, Truck } from "lucide-react";
import type {
  DrivingLogStats,
  InUseVehicle,
  StatusConfig,
  Vehicle,
} from "../types/vehicle.ts";

// ステータス設定（デザイン案のスタイル通り）
export const statusConfig: Record<string, StatusConfig> = {
  available: {
    label: "利用可能",
    bgGradient: "from-blue-100 to-cyan-100", // Green → Blue-Cyan
    textColor: "text-blue-700",
    buttonDisabled: false,
  },
  "in-use": {
    label: "使用中",
    bgGradient: "from-pink-100 to-rose-100", // そのまま
    textColor: "text-pink-700",
    buttonDisabled: true,
  },
  maintenance: {
    label: "点検中",
    bgGradient: "from-orange-100 to-red-100", // Amber → Orange-Red
    textColor: "text-orange-700",
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
    iconColorFrom: "purple-500",
    iconColorTo: "indigo-600",
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
    iconColorFrom: "blue-500",
    iconColorTo: "cyan-600",
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
    iconColorFrom: "orange-500",
    iconColorTo: "red-600",
  },
];

// 使用中車両のサンプルデータ（デザイン案の運転日誌セクション用）
export const inUseVehicles: InUseVehicle[] = [
  {
    id: "2", // 既存の車両2（日産セレナ）
    licensePlate: "品川 500 か 5678",
    make: "日産",
    model: "セレナ",
    currentUser: "佐藤花子",
    startTime: "09:30",
    icon: Truck,
    iconColorFrom: "blue-500",
    iconColorTo: "cyan-600",
  },
  {
    id: "4", // 新しい使用中車両（トヨタ アクア）
    licensePlate: "品川 500 た 9999",
    make: "トヨタ",
    model: "アクア",
    currentUser: "田中太郎",
    startTime: "14:15",
    icon: Car,
    iconColorFrom: "purple-500",
    iconColorTo: "indigo-600",
  },
];

// 運転日誌統計データ
export const drivingLogStats: DrivingLogStats = {
  inUseVehicles: 2, // 現在使用中の車両数
  todayLogs: 5, // 今日の記録数
};
