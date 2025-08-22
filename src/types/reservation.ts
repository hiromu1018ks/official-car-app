import type {
  Reservation as PrismaReservation,
  ReservationStatus as PrismaReservationStatus,
  User,
  Vehicle,
} from "@/generated/prisma/index.js";

/**
 * 予約情報を表すインターフェース
 */
export interface Reservation {
  id: string;
  startTime: Date;
  endTime: Date;
  destination?: string;
  status: ReservationStatus;
  vehicleId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 予約状態の型定義
 */
export type ReservationStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

/**
 * リレーション付きの予約型
 */
export type ReservationWithRelations = PrismaReservation & {
  vehicle: Vehicle;
  user: User;
};

/**
 * DBの予約ステータス(enum)をフロントエンド用の文字列に変換
 */
export function statusDbToFrontend(
  status: PrismaReservationStatus
): ReservationStatus {
  const statusMap = {
    SCHEDULED: "scheduled",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  } as const;

  return statusMap[status];
}
/**
 * フロントエンド用のステータスをDB用(enum)に変換
 */
export function statusFrontendToDb(
  status: ReservationStatus
): PrismaReservationStatus {
  const statusMap = {
    scheduled: "SCHEDULED",
    "in-progress": "IN_PROGRESS",
    completed: "COMPLETED",
    cancelled: "CANCELLED",
  } as const;

  return statusMap[status];
}

// Server Actionsの戻り値型を正確に定義
export interface ServerActionResult {
  success?: boolean;
  error?: string;
  details?: Record<string, unknown>;
}
