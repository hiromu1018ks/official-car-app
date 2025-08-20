import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "../prisma.ts";
import { reservationSchema } from "../schemas/reservation.ts";

/**
 * 車両予約アクション
 * - バリデーション
 * - 予約の重複チェック
 * - 予約作成
 * - キャッシュ再検証
 * @param formData フォームデータ
 * @param userId 予約ユーザーID
 */
export async function reserveVehicleAction(formData: FormData, userId: string) {
  // フォームデータを取得
  const rawData = {
    vehicleId: formData.get("vehicleId"),
    startDateTime: formData.get("startDateTime"),
    endDateTime: formData.get("endDateTime"),
    destination: formData.get("destination"),
  };

  // 入力値バリデーション
  const validatedData = reservationSchema.safeParse(rawData);

  if (!validatedData.success) {
    // バリデーションエラー時は詳細を返す
    const tree = z.treeifyError(validatedData.error);

    return {
      error: "入力内容を確認してください",
      details: tree.properties,
    };
  }

  try {
    // 予約の重複チェック（同じ車両・期間が重複する予約が存在するか）
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        vehicle_id: validatedData.data.vehicleId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] },
        AND: [
          { start_time: { lt: validatedData.data.endDateTime } },
          { end_time: { gt: validatedData.data.startDateTime } },
        ],
      },
    });

    if (conflictingReservation) {
      // 重複があればエラーを返す
      return {
        error: "この時間帯は既に予約されています",
      };
    }

    // 予約レコードを作成
    await prisma.reservation.create({
      data: {
        vehicle_id: validatedData.data.vehicleId,
        start_time: validatedData.data.startDateTime,
        end_time: validatedData.data.endDateTime,
        destination: validatedData.data.destination,
        user_id: userId,
        status: "SCHEDULED",
      },
    });

    // トップページのキャッシュを再検証
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    // 例外発生時はエラーログを出力し、エラーを返す
    console.error("Reservation error:", error);

    return { error: "予約に失敗しました。再度お試しください。" };
  }
}
