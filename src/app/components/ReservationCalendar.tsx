"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import type { VehicleStatus } from "@/generated/prisma";
import { useReservations } from "@/lib/hooks/useReservations.ts";
import type { Vehicle } from "@/types/vehicle.ts";
import { ReservationModal } from "./ReservationModal.tsx";

/**
 * 予約データと関連する車両・ユーザー情報を含むオブジェクトの型定義
 * APIから取得される予約データの完全な構造を表現
 */
interface ReservationWithDetails {
  id: string; // 予約ID
  vehicle_id: string; // 車両ID
  start_time: string; // 利用開始日時（ISO文字列形式）
  end_time: string; // 利用終了日時（ISO文字列形式）
  destination: string | null; // 利用目的・行き先（任意）
  status: string; // 予約状態（SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED）
  vehicle: {
    make: string; // 車両メーカー
    model: string; // 車両モデル
    license_plate: string; // ナンバープレート
    icon: string; // アイコン名
    icon_color_from: string; // グラデーション開始色
    icon_color_to: string; // グラデーション終了色
  };
  user: {
    name: string; // ユーザー名
    email: string; // メールアドレス
  };
}

interface VehicleApiResponse {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  status: VehicleStatus;
  icon: string;
  icon_color_from: string;
  icon_color_to: string;
  next_inspection: string;
  created_at: string;
  updated_at: string;
}

/**
 * 指定された日付を含む週の7日間を取得する関数
 *
 * 処理ロジック:
 * 1. 指定日の曜日を取得（0=日曜, 1=月曜, ..., 6=土曜）
 * 2. 週の開始日（日曜日）を計算
 * 3. 日曜日から土曜日までの7日間の配列を生成
 *
 * @param date - 基準となる日付
 * @returns 週の7日間のDate配列（日曜日から土曜日の順）
 */
const getWeekDays = (date: Date): Date[] => {
  const start = new Date(date);
  const day = start.getDay(); // 曜日を取得（0=日曜）
  const diff = start.getDate() - day; // 週の開始日（日曜日）までの差分
  start.setDate(diff); // 週の開始日に設定

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(start);
    weekDay.setDate(start.getDate() + i); // 日曜日から順に7日間生成
    weekDays.push(weekDay);
  }

  return weekDays;
};

/**
 * 指定された日付の予約一覧を取得する関数
 *
 * フィルタリング条件:
 * - 予約の開始時刻の日付が指定日と一致するもの
 * - 時分秒は考慮せず、年月日のみで比較
 *
 * @param reservations - 全予約データの配列
 * @param targetDate - フィルタリング対象の日付
 * @returns 指定日の予約データ配列
 */
const getReservationsForDay = (
  reservations: ReservationWithDetails[],
  targetDate: Date
): ReservationWithDetails[] => {
  return reservations.filter((reservation) => {
    const startDate = new Date(reservation.start_time);

    // 日付文字列で比較（時分秒を無視）
    return startDate.toDateString() === targetDate.toDateString();
  });
};

/**
 * 予約カレンダーコンポーネント
 *
 * 機能:
 * - 週単位での予約表示（日曜日から土曜日）
 * - 前週・次週への移動
 * - 各日の予約一覧表示
 * - 予約詳細の表示（クリック・キーボード操作対応）
 * - アクセシビリティ対応（キーボード操作、スクリーンリーダー対応）
 *
 * 使用例:
 * ```tsx
 * <ReservationCalendar />
 * ```
 */
export function ReservationCalendar() {
  // 予約データの取得（ローディング・エラー状態含む）
  const { reservations, loading, error, refetch } = useReservations();

  // 現在表示中の週の基準日（デフォルトは今日）
  const [currentDate, setCurrentDate] = useState(new Date());

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    reservation: ReservationWithDetails | null;
  }>({
    isOpen: false,
    mode: "create",
    reservation: null,
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const apiVehicles = (await response.json()) as VehicleApiResponse[];

        const convertedVehicles: Vehicle[] = apiVehicles.map((v) => ({
          id: v.id,
          make: v.make,
          model: v.model,
          year: v.year,
          licensePlate: v.license_plate, // 変換
          status:
            v.status === "AVAILABLE"
              ? "available"
              : v.status === "IN_USE"
                ? "in-use"
                : "maintenance",
          icon: v.icon,
          iconColorFrom: v.icon_color_from, // 変換
          iconColorTo: v.icon_color_to, // 変換
          nextInspection: (() => {
            try {
              const date = new Date(v.next_inspection);

              return isNaN(date.getTime())
                ? "2024-01-01"
                : date.toISOString().split("T")[0];
            } catch {
              return "2024-01-01";
            }
          })(),
        }));
        setVehicles(convertedVehicles);
      } catch (error) {
        console.error("車両データの取得に失敗:", error);
      }
    };

    void fetchVehicles();
  }, []);

  // ローディング中の表示
  if (loading) return <div className="p-4">Loading...</div>;

  // エラー時の表示
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  // 現在の週の7日間を取得
  const weekDays = getWeekDays(currentDate);

  /**
   * 前週に移動する処理
   * 現在の基準日から7日前の日付に更新
   */
  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7); // 7日前に設定
    setCurrentDate(prev);
  };

  /**
   * 次週に移動する処理
   * 現在の基準日から7日後の日付に更新
   */
  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7); // 7日後に設定
    setCurrentDate(next);
  };

  /**
   * 予約クリック時の処理
   * TODO: モーダルでの詳細表示やページ遷移などの実装予定
   *
   * @param reservation - クリックされた予約データ
   */
  const handleReservationClick = (reservation: ReservationWithDetails) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      reservation,
    });
  };

  /**
   * 予約のキーボード操作時の処理
   * EnterキーまたはSpaceキーでクリックと同様の動作を実行
   * アクセシビリティ対応のため必須
   *
   * @param e - キーボードイベント
   * @param reservation - 操作対象の予約データ
   */
  const handleReservationKeyDown = (
    e: React.KeyboardEvent,
    reservation: ReservationWithDetails
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // デフォルト動作を防止
      handleReservationClick(reservation);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* ヘッダー部分：タイトルと週移動ボタン */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">予約カレンダー</h2>
        <div className="flex gap-2">
          <Button
            onClick={handlePrevWeek}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            aria-label="前週を表示"
          >
            ← 前週
          </Button>
          <Button
            onClick={handleNextWeek}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            aria-label="次週を表示"
          >
            次週 →
          </Button>
        </div>
      </div>

      {/* カレンダーグリッド：7列（日〜土） */}
      <div className="grid grid-cols-7 gap-1">
        {/* 曜日ヘッダー */}
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div key={day} className="p-2 text-center font-medium bg-gray-100">
            {day}
          </div>
        ))}

        {/* 各日のセル：日付と予約一覧 */}
        {weekDays.map((day) => {
          const dayReservations = getReservationsForDay(reservations, day);

          return (
            <div key={day.toISOString()} className="min-h-[120px] p-2 border">
              {/* 日付表示 */}
              <div className="text-sm font-medium mb-2">{day.getDate()}</div>

              {/* その日の予約一覧 */}
              {dayReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  role="button" // スクリーンリーダー用の役割定義
                  tabIndex={0} // キーボードフォーカス可能にする
                  className="p-1 mb-1 text-xs bg-blue-100 rounded cursor-pointer hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleReservationClick(reservation)}
                  onKeyDown={(e) => handleReservationKeyDown(e, reservation)}
                  aria-label={`予約詳細: ${reservation.vehicle.make} ${reservation.vehicle.model}, ${new Date(
                    reservation.start_time
                  ).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                >
                  {/* 車両情報表示 */}
                  <div>
                    {reservation.vehicle.make} {reservation.vehicle.model}
                  </div>

                  {/* 開始時刻表示（時分のみ） */}
                  <div>
                    {new Date(reservation.start_time).toLocaleTimeString(
                      "ja-JP",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <ReservationModal
        {...(modalState.mode === "create"
          ? { mode: "create", vehicles }
          : modalState.mode === "edit"
            ? {
                mode: "edit",
                reservation: modalState.reservation!,
                vehicles,
                onUpdate: () => {
                  // 予約データを再取得
                  void refetch();
                },
              }
            : {
                mode: "view",
                reservation: modalState.reservation!,
              })}
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({ isOpen: false, mode: "create", reservation: null })
        }
      />
    </div>
  );
}
