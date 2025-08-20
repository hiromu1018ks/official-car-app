import { z } from "zod";

// 予約フォームのバリデーションスキーマ
export const reservationSchema = z
  .object({
    // 1. 車両ID（必須: モーダル選択時のみ必要）
    vehicleId: z.string().min(1, "車両を選択してください"),

    // 2. 利用開始日時（必須: 未来の日付のみ許可）
    startDateTime: z
      .string()
      .min(1, "利用開始日時を選択してください")
      .transform((str) => new Date(str)) // 文字列→Date型に変換
      .refine(
        (date) => !isNaN(date.getTime()),
        "正しい日時形式で入力してください"
      )
      .refine(
        (date) => date > new Date(),
        "開始日時は現在時刻より後に設定してください"
      ),

    // 3. 利用終了日時（必須）
    endDateTime: z
      .string()
      .min(1, "利用終了日時を選択してください")
      .transform((str) => new Date(str)) // 文字列→Date型に変換
      .refine(
        (date) => !isNaN(date.getTime()),
        "正しい日時形式で入力してください"
      ),

    // 4. 目的地（任意: 最大200文字まで）
    destination: z
      .string()
      .max(200, "目的地は200文字以内で入力してください")
      .optional(),
  })
  // 開始日時より終了日時が後であることを検証
  .refine((data) => data.endDateTime > data.startDateTime, {
    message: "終了日時は開始日時より後に設定してください",
    path: ["endDateTime"], // エラーをendDateTimeフィールドに関連付け
  });

// デフォルトエクスポート（推奨: 名前付きエクスポートのみでもOK）
export default reservationSchema;
