import { dbToFrontendVehicle, type Vehicle } from "@/types/vehicle.ts";
import prisma from "./prisma.ts";

/**
 * データベースから車両一覧を取得し、フロントエンド用のVehicle型に変換して返す
 * @returns Vehicle型の配列（キャメルケース・アイコン変換済み）
 */
export async function getVehicles(): Promise<Vehicle[]> {
  try {
    // Prismaで全車両データを取得（snake_caseのまま）
    const vehicles = await prisma.vehicle.findMany();

    // 取得したデータをフロントエンド用Vehicle型（camelCase）に変換
    const convertedVehicles = vehicles.map((vehicle) => {
      return dbToFrontendVehicle(vehicle);
    });

    return convertedVehicles;
  } catch (error) {
    // エラー発生時はログ出力し、上位にエラーを投げる
    console.error("Error fetching vehicles:", error);
    throw new Error("Failed to fetch vehicles");
  }
}

/**
 * 車両の統計情報（総数・利用可能・使用中・点検中）を取得する
 * @returns 各状態ごとの車両数
 */
export async function getVehicleStats(): Promise<{
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
}> {
  try {
    // 各状態ごとにカウント
    const total = await prisma.vehicle.count();
    const available = await prisma.vehicle.count({
      where: {
        status: "AVAILABLE",
      },
    });
    const inUse = await prisma.vehicle.count({
      where: {
        status: "IN_USE",
      },
    });
    const maintenance = await prisma.vehicle.count({
      where: {
        status: "MAINTENANCE",
      },
    });

    return {
      total,
      available,
      inUse,
      maintenance,
    };
  } catch (error) {
    // エラー発生時はログ出力し、上位にエラーを投げる
    console.error("Error fetching vehicle stats:", error);
    throw new Error("Failed to fetch vehicle stats");
  }
}

/**
 * 使用中の車両一覧を取得する
 * @returns statusが"in-use"のVehicle型配列
 */
export async function getInUseVehicles() {
  try {
    // 全車両データを取得し、statusでフィルタ
    const vehicles = await getVehicles();

    return vehicles.filter((vehicle) => vehicle.status === "in-use");
  } catch (error) {
    // エラー発生時はログ出力し、上位にエラーを投げる
    console.error("Error fetching in-use vehicles:", error);
    throw new Error("Failed to fetch in-use vehicles");
  }
}

/**
 * 運転日誌セクションの統計情報を取得する
 * @returns 使用中車両数・本日分の運転記録数
 */
export async function getDrivingLogStats() {
  try {
    // 使用中車両数を取得
    const inUseVehicles = (await getInUseVehicles()).length;

    // 本日の日付範囲を計算
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 本日分の運転記録数をカウント
    const todayLog = await prisma.drivingLog.count({
      where: {
        created_at: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return {
      inUseVehicles,
      todayLog,
    };
  } catch (error) {
    // エラー発生時はログ出力し、上位にエラーを投げる
    console.error("Error fetching driving log stats:", error);
    throw new Error("Failed to fetch driving log stats");
  }
}
