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

    // 日時文字列をISO形式に変換（DB保存用）
    const startDateTime = new Date(
      validatedData.data.startDateTime
    ).toISOString();
    const endDateTime = new Date(validatedData.data.endDateTime).toISOString();

    // 予約の重複チェック（同じ車両・期間が重複する予約が存在するか）
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        vehicle_id: validatedData.data.vehicleId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] },
        AND: [
          { start_time: { lt: endDateTime } },
          { end_time: { gt: startDateTime } },
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
        vehicle_id: validatedData.data.vehicleId, // 車両ID
        start_time: startDateTime, // 利用開始日時（ISO文字列）
        end_time: endDateTime, // 利用終了日時（ISO文字列）
        destination: validatedData.data.destination, // 利用目的
        user_id: "cmeh4frya0004y9t2yp2nhnnj", // TODO: 認証実装後は実ユーザーIDをセット
        status: "SCHEDULED", // 予約状態
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
