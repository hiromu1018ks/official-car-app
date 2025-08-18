import type { Prisma } from "@/generated/prisma/index.js";
import prisma from "../src/lib/prisma";

const vehiclesData: Prisma.VehicleCreateInput[] = [
  {
    license_plate: "品川 500 あ 1234",
    make: "トヨタ",
    model: "プリウス",
    year: 2022,
    status: "AVAILABLE",
    next_inspection: new Date("2024/03/15"),
    icon: "Car",
    icon_color_from: "from-purple-500",
    icon_color_to: "to-indigo-600",
  },
  {
    license_plate: "品川 500 か 5678",
    make: "日産",
    model: "セレナ",
    year: 2021,
    status: "IN_USE",
    next_inspection: new Date("2024/04/20"),
    icon: "Truck",
    icon_color_from: "from-blue-500",
    icon_color_to: "to-cyan-600",
  },
  {
    license_plate: "品川 500 さ 9012",
    make: "ホンダ",
    model: "フリード",
    year: 2020,
    status: "MAINTENANCE",
    next_inspection: new Date("2024/02/28"),
    icon: "CarFront",
    icon_color_from: "from-orange-500",
    icon_color_to: "to-red-600",
  },
  {
    license_plate: "品川 500 た 9999",
    make: "トヨタ",
    model: "アクア",
    year: 2023,
    status: "IN_USE",
    next_inspection: new Date("2024/05/30"),
    icon: "Car",
    icon_color_from: "from-purple-500",
    icon_color_to: "to-indigo-600",
  },
];

const userData: Prisma.UserCreateInput[] = [
  {
    name: "佐藤花子",
    email: "sato.hanako@company.com",
    password: "hashed_password_1", // 実際は適切にハッシュ化
    role: "general",
  },
  {
    name: "田中太郎",
    email: "tanaka.taro@company.com",
    password: "hashed_password_2",
    role: "general",
  },
];

const drivingLogData: Prisma.DrivingLogCreateInput[] = [
  {
    id: "1",
    start_time: new Date("2025-08-18T09:30:00Z"),
    end_time: null,
    start_meter: null,
    end_meter: null,
    destination: null,
    is_refueling: false,
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    vehicle: {
      connect: {
        license_plate: "品川 500 か 5678",
      },
    },
    user: {
      connect: {
        email: "sato.hanako@company.com",
      },
    },
  },
  {
    id: "2",
    start_time: new Date("2025-08-18T14:15:00Z"),
    end_time: null,
    start_meter: null,
    end_meter: null,
    destination: null,
    is_refueling: false,
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    vehicle: {
      connect: {
        license_plate: "品川 500 た 9999",
      },
    },
    user: {
      connect: {
        email: "tanaka.taro@company.com",
      },
    },
  },
  {
    id: "3",
    start_time: new Date("2025-08-17T10:00:00Z"),
    end_time: new Date("2025-08-17T16:30:00Z"),
    start_meter: 13999,
    end_meter: 14120,
    destination: "東京都千代田区丸の内1-1-1",
    is_refueling: true,
    notes: "定期巡回完了。給油しました。",
    created_at: new Date(),
    updated_at: new Date(),
    vehicle: {
      connect: {
        license_plate: "品川 500 あ 1234",
      },
    },
    user: {
      connect: {
        email: "tanaka.taro@company.com",
      },
    },
  },
  {
    id: "4",
    start_time: new Date("2025-08-16T08:45:00Z"),
    end_time: new Date("2025-08-16T12:00:00Z"),
    start_meter: 8520,
    end_meter: 8580,
    destination: "東京都渋谷区道玄坂2-1-1",
    is_refueling: false,
    notes: "会議参加のため使用。",
    created_at: new Date(),
    updated_at: new Date(),
    vehicle: {
      connect: {
        license_plate: "品川 500 か 5678",
      },
    },
    user: {
      connect: {
        email: "sato.hanako@company.com",
      },
    },
  },
  {
    id: "5",
    start_time: new Date("2025-08-15T13:20:00Z"),
    end_time: new Date("2025-08-15T17:45:00Z"),
    start_meter: 25100,
    end_meter: 25240,
    destination: "神奈川県横浜市西区みなとみらい2-2-1",
    is_refueling: false,
    notes: "クライアント訪問完了。",
    created_at: new Date(),
    updated_at: new Date(),
    vehicle: {
      connect: {
        license_plate: "品川 500 た 9999",
      },
    },
    user: {
      connect: {
        email: "tanaka.taro@company.com",
      },
    },
  },
];

export async function main() {
  for (const vehicle of vehiclesData) {
    await prisma.vehicle.upsert({
      where: { license_plate: vehicle.license_plate },
      update: {},
      create: vehicle,
    });
  }

  for (const user of userData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  for (const drivingLog of drivingLogData) {
    await prisma.drivingLog.upsert({
      where: {
        id: drivingLog.id,
      },
      update: {},
      create: drivingLog,
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
