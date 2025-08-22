import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma.ts";
import { reservationSchema } from "@/lib/schemas/reservation.ts";

/**
 * 予約作成APIエンドポイント（POST /api/reservations）
 * - 入力バリデーション
 * - 予約の重複チェック
 * - 予約レコード作成
 * - キャッシュ再検証
 */
export async function POST(request: Request) {
  try {
    // リクエストボディを取得・型付け
    const data = (await request.json()) as {
      vehicleId: string;
      startDateTime: string;
      endDateTime: string;
      destination: string;
    };

    // 入力値バリデーション（Zodスキーマ利用）
    const validatedData = reservationSchema.safeParse(data);

    if (!validatedData.success) {
      // バリデーションエラー時は詳細を返す
      const tree = z.treeifyError(validatedData.error);

      return NextResponse.json(
        {
          error: "入力内容を確認してください",
          details: tree.properties,
        },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        {
          error: "この時間帯は既に予約されています",
        },
        { status: 409 }
      );
    }

    // 予約レコードを作成
    await prisma.reservation.create({
      data: {
        vehicle_id: validatedData.data.vehicleId,
        start_time: validatedData.data.startDateTime,
        end_time: validatedData.data.endDateTime,
        destination: validatedData.data.destination,
        user_id: "user-1", // TODO: 認証実装後は実ユーザーIDをセット
        status: "SCHEDULED",
      },
    });

    // トップページのキャッシュを再検証
    revalidatePath("/");

    // 成功レスポンス
    return NextResponse.json({ success: true });
  } catch (error) {
    // 例外発生時はエラーログを出力し、エラーレスポンスを返す
    console.error("Reservation error:", error);

    return NextResponse.json(
      { error: "予約に失敗しました。再度お試しください。" },
      { status: 500 }
    );
  }
}
