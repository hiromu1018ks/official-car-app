"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { reservationSchema } from "@/lib/schemas/reservation.ts";
import type { Vehicle } from "@/types/vehicle.ts";

// ReservationModalコンポーネントのprops型定義
interface ReservationModalProps {
  vehicles: Vehicle[]; // 選択可能な車両リスト
  isOpen: boolean; // モーダル表示状態
  onClose: () => void; // モーダルを閉じる関数
}

// フォームデータ型定義
interface formDataTypes {
  vehicleId: string; // 選択した車両ID
  startDateTime: string; // 利用開始日時（文字列）
  endDateTime: string; // 利用終了日時（文字列）
  destination?: string; // 利用目的（任意）
}

interface ReservationResponse {
  success?: boolean;
  error?: string;
}

// 車両予約モーダル
export function ReservationModal({
  vehicles,
  isOpen,
  onClose,
}: ReservationModalProps) {
  // 送信中状態管理
  const [isSubmitting, setIsSubmitting] = useState(false);
  // エラーメッセージ管理
  const [error, setError] = useState<null | string>(null);

  // フォーム送信処理
  const handleSubmit = async (data: formDataTypes) => {
    console.log("handleSubmit called with:", data); // この行を追加
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: data.vehicleId,
          startDateTime: data.startDateTime,
          endDateTime: data.endDateTime,
          destination: data.destination || "",
        }),
      });

      const result = (await response.json()) as ReservationResponse;

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log("Result:", result);

      if (response.ok && result.success) {
        onClose();
      } else {
        setError(result.error ?? "予約に失敗しました");
      }
    } catch {
      // 例外発生時のエラーハンドリング
      setError("予約処理中にエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // React Hook Formの初期化
  const form = useForm<formDataTypes>({
    resolver: zodResolver(reservationSchema), // Zodスキーマでバリデーション
    defaultValues: {
      vehicleId: "",
      startDateTime: "",
      endDateTime: "",
      destination: "",
    },
  });

  // モーダル本体
  return (
    isOpen && (
      <div
        id="modal"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        {/* 予約フォーム */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(handleSubmit)(e);
          }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full mx-4 border border-white/20">
            {/* ヘッダー */}
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-xl font-bold gradient-text">
                車両を予約する
              </h3>
            </div>
            {/* 入力フィールド */}
            <div className="px-8 py-6 space-y-6">
              {/* 車両選択 */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  車両を選択
                </Label>
                <select
                  {...form.register("vehicleId")}
                  className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
                >
                  <option value="">選択してください</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate} - {vehicle.make} {vehicle.model}
                    </option>
                  ))}
                </select>
                {/* バリデーションエラー表示 */}
                {form.formState.errors.vehicleId && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.vehicleId.message}
                  </p>
                )}
              </div>
              {/* 利用開始日時 */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  利用開始日時
                </Label>
                <Input
                  {...form.register("startDateTime")}
                  type="datetime-local"
                  className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
                />
                {form.formState.errors.startDateTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.startDateTime.message}
                  </p>
                )}
              </div>
              {/* 利用終了日時 */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  利用終了日時
                </Label>
                <Input
                  {...form.register("endDateTime")}
                  type="datetime-local"
                  className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
                />
                {form.formState.errors.endDateTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.endDateTime.message}
                  </p>
                )}
              </div>
              {/* 利用目的 */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  利用目的
                </Label>
                <Textarea
                  {...form.register("destination")}
                  placeholder="出張、会議、その他の業務など..."
                  className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm h-24 resize-none"
                ></Textarea>
                {form.formState.errors.destination && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.destination.message}
                  </p>
                )}
              </div>
            </div>
            {/* エラーメッセージ表示 */}
            {error && (
              <div className="px-8 py-2">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {/* ボタンエリア */}
            <div className="px-8 py-6 border-t border-gray-100 flex justify-end space-x-4">
              <Button
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all shadow-md"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                予約を確定する
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  );
}
