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
];

export async function main() {
  for (const vehicle of vehiclesData) {
    await prisma.vehicle.upsert({
      where: { license_plate: vehicle.license_plate },
      update: {},
      create: vehicle,
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
