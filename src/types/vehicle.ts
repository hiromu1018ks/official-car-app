import { Car, CarFront, type LucideIcon, Truck } from "lucide-react";
import type {
  Vehicle as PrismaVehicle,
  VehicleStatus as PrismaVehicleStatus,
} from "../generated/prisma/index.js";

/**
 * 車両情報を表すインターフェース
 */
export interface Vehicle {
  id: string; // 車両ID
  licensePlate: string; // ナンバープレート
  make: string; // メーカー名
  model: string; // モデル名
  year: number; // 年式
  status: "available" | "in-use" | "maintenance"; // 現在の状態
  currentUser?: string; // 現在使用中のユーザー（任意）
  nextInspection: string; // 次回点検日（ISO形式などの文字列）
  icon: LucideIcon; // 車両を表すアイコンコンポーネント
  iconColorFrom: string; // アイコンのグラデーション開始色
  iconColorTo: string; // アイコンのグラデーション終了色
}

/**
 * 車両の状態を表す型
 */
export type VehicleStatus = "available" | "in-use" | "maintenance";

/**
 * 各状態ごとの表示設定
 */
export interface StatusConfig {
  label: string; // 状態のラベル
  bgGradient: string; // 背景グラデーションのクラス
  textColor: string; // テキストカラーのクラス
  buttonDisabled: boolean; // ボタンの無効化状態
}

/**
 * 使用中車両の詳細情報を表すインターフェース
 */
export interface InUseVehicle {
  id: string; // 車両ID
  licensePlate: string; // ナンバープレート
  make: string; // メーカー名
  model: string; // モデル名
  currentUser: string; // 現在の使用者
  startTime: string; // 使用開始時刻 (例: "09:30")
  icon: LucideIcon; // 車両アイコン
  iconColorFrom: string; // アイコンのグラデーション開始色
  iconColorTo: string; // アイコンのグラデーション終了色
}

/**
 * 運転日誌セクションの統計情報
 */
export interface DrivingLogStats {
  inUseVehicles: number; // 使用中車両数
  todayLogs: number; // 今日の記録数
}

// PrismaのVehicle型にリレーション情報を加えた型
export type VehicleWithUser = PrismaVehicle & {
  user?: { name: string } | null;
};

// ========= 変換関数 =========

/**
 * DBの車両データをフロントエンド用Vehicle型に変換する
 * @param dbVehicle - Prismaから取得した車両データ
 * @returns Vehicle型のデータ
 */
export function dbToFrontendVehicle(dbVehicle: VehicleWithUser): Vehicle {
  return {
    id: dbVehicle.id,
    licensePlate: dbVehicle.license_plate,
    make: dbVehicle.make,
    model: dbVehicle.model,
    year: dbVehicle.year,
    status: statusDbToFrontend(dbVehicle.status),
    currentUser: dbVehicle.user?.name || undefined, // 任意なのでundefinedも許容
    nextInspection: dbVehicle.next_inspection.toISOString().split("T")[0], // 日付のみ
    icon: getIconComponent(dbVehicle.icon), // アイコンはコンポーネントとして扱う
    iconColorFrom: dbVehicle.icon_color_from,
    iconColorTo: dbVehicle.icon_color_to,
  };
}

// フロントエンド → DB変換（将来のCRUD用）
export function frontendToDbVehicle(
  vehicle: Vehicle
): Omit<PrismaVehicle, "id" | "created_at" | "updated_at"> {
  return {
    license_plate: vehicle.licensePlate,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    status: statusFrontendToDb(vehicle.status),
    next_inspection: new Date(vehicle.nextInspection),
    icon: getIconName(vehicle.icon),
    icon_color_from: vehicle.iconColorFrom,
    icon_color_to: vehicle.iconColorTo,
  };
}

/**
 * DBの車両ステータス(enum)をフロントエンド用の文字列に変換する
 * @param status - PrismaのVehicleStatus(enum)
 * @returns フロントエンド用のステータス文字列
 */
function statusDbToFrontend(
  status: PrismaVehicleStatus
): "available" | "in-use" | "maintenance" {
  const statusMap = {
    AVAILABLE: "available",
    IN_USE: "in-use",
    MAINTENANCE: "maintenance",
  } as const;

  return statusMap[status];
}

/**
 * フロントエンド用の車両ステータス文字列をDB用(enum)に変換する
 * @param status - フロントエンド用のステータス文字列
 * @returns PrismaのVehicleStatus(enum)
 */
function statusFrontendToDb(
  status: "available" | "in-use" | "maintenance"
): PrismaVehicleStatus {
  const statusMap = {
    available: "AVAILABLE",
    "in-use": "IN_USE",
    maintenance: "MAINTENANCE",
  } as const;

  return statusMap[status];
}

/**
 * アイコン名からLucideアイコンコンポーネントを取得する
 * @param iconName - アイコン名
 * @returns LucideIcon型のReactコンポーネント
 */
export function getIconComponent(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    Car: Car,
    Truck: Truck,
    CarFront: CarFront,
  };

  return iconMap[iconName] || Car;
}

/**
 * Lucideアイコンコンポーネントからアイコン名を取得する
 * @param icon - LucideIcon型のReactコンポーネント
 * @returns アイコン名（文字列）
 */
export function getIconName(icon: LucideIcon): string {
  switch (icon) {
    case Car:
      return "Car";
    case Truck:
      return "Truck";
    case CarFront:
      return "CarFront";
    default:
      return "Car";
  }
}
