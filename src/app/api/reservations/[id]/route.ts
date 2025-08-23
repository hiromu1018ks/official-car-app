import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma.ts";
import { reservationSchema } from "@/lib/schemas/reservation.ts";

/**
 * 予約更新のリクエストボディの型定義
 * フロントエンドから送信される予約更新データの構造
 */
interface ReservationUpdateTypes {
  vehicleId: string; // 車両ID
  startDateTime: string; // 利用開始日時（ISO文字列形式）
  endDateTime: string; // 利用終了日時（ISO文字列形式）
  destination: string; // 利用目的・行き先
}

/**
 * 予約更新APIエンドポイント（PUT /api/reservations/[id]）
 *
 * 処理フロー:
 * 1. リクエストボディの取得・型付け
 * 2. 入力値のバリデーション（Zodスキーマ利用）
 * 3. 予約の存在確認
 * 4. 予約状態の確認（編集可能かチェック）
 * 5. 予約の重複チェック（同一車両・時間帯）
 * 6. 予約レコードの更新
 * 7. キャッシュの再検証
 *
 * 制約:
 * - 「SCHEDULED」状態の予約のみ編集可能
 * - 更新後の時間帯で他の予約と重複しないこと
 *
 * @param request - HTTPリクエストオブジェクト
 * @param params - パス・パラメーター（予約ID）
 * @returns 成功時: { success: true }, エラー時: エラーメッセージとステータスコード
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // URLパラメーターから予約IDを取得
    const reservationId = params.id;

    // リクエストボディを取得・型付け
    const data = (await request.json()) as ReservationUpdateTypes;

    // 入力値バリデーション（Zodスキーマ利用）
    const validatedData = reservationSchema.safeParse(data);

    if (!validatedData.success) {
      // バリデーションエラー時は詳細なエラー情報を構築して返す
      const tree = z.treeifyError(validatedData.error);

      return NextResponse.json(
        { error: "入力内容を確認してください", details: tree.properties },
        { status: 400 }
      );
    }

    // 日時文字列をISO形式に変換（データベース保存用の標準フォーマット）
    const startDateTime = new Date(
      validatedData.data.startDateTime
    ).toISOString();
    const endDateTime = new Date(validatedData.data.endDateTime).toISOString();

    // 対象の予約が存在するかチェック
    const existsReservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!existsReservation) {
      // 予約が見つからない場合はNot Foundエラーを返す
      return NextResponse.json(
        {
          error: "予約が存在しません。",
        },
        { status: 404 } // 404 Not Found
      );
    }

    // 予約状態が編集可能かチェック（「予定」状態のみ編集可能）
    if (existsReservation.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "この予約は編集できません" },
        { status: 400 } // 400 Bad Request
      );
    }

    // 予約の重複チェック（自分以外の予約で時間帯が重複するものを検索）
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        vehicle_id: validatedData.data.vehicleId, // 同じ車両
        status: { in: ["SCHEDULED", "IN_PROGRESS"] }, // アクティブな予約のみ
        id: { not: reservationId }, // 自分以外の予約
        AND: [
          { start_time: { lt: endDateTime } }, // 既存予約の開始時刻 < 新規予約の終了時刻
          { end_time: { gt: startDateTime } }, // 既存予約の終了時刻 > 新規予約の開始時刻
        ],
      },
    });

    if (conflictingReservation) {
      // 重複する予約が存在する場合はConflictエラーを返す
      return NextResponse.json(
        { error: "この時間帯は既に予約されています" },
        { status: 409 } // 409 Conflict
      );
    }

    // 予約レコードをデータベースで更新
    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        vehicle_id: validatedData.data.vehicleId, // 車両ID
        start_time: startDateTime, // 利用開始日時（ISO文字列形式）
        end_time: endDateTime, // 利用終了日時（ISO文字列形式）
        destination: validatedData.data.destination, // 利用目的・行き先
      },
    });

    // トップページのキャッシュを再検証（予約情報の更新を反映）
    revalidatePath("/");

    // 成功レスポンスを返却
    return NextResponse.json({ success: true });
  } catch (error) {
    // 予期しない例外が発生した場合のエラーハンドリング
    console.error("Reservation update error:", error);

    return NextResponse.json(
      {
        error: "予約の更新に失敗しました。再度お試しください。",
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

/**
 * 予約削除APIエンドポイント（DELETE /api/reservations/[id]）
 *
 * 処理フロー:
 * 1. パス・パラメーターから予約IDを取得
 * 2. 予約の存在確認
 * 3. 予約状態の確認（削除可能かチェック）
 * 4. 予約レコードの物理削除
 * 5. キャッシュの再検証
 *
 * 制約:
 * - 「SCHEDULED」状態の予約のみ削除可能
 * - 進行中や完了済みの予約は削除不可
 *
 * @param request - HTTPリクエストオブジェクト
 * @param params - パス・パラメーター（予約ID）
 * @returns 成功時: { success: true }, エラー時: エラーメッセージとステータスコード
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // URLパラメーターから予約IDを取得
    const reservationId = params.id;

    // 対象の予約が存在するかチェック
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!existingReservation) {
      // 予約が見つからない場合はNot Foundエラーを返す
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 } // 404 Not Found
      );
    }

    // 予約状態が削除可能かチェック（「予定」状態のみ削除可能）
    if (existingReservation.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "この予約は削除できません" },
        { status: 400 } // 400 Bad Request
      );
    }

    // 予約レコードをデータベースから物理削除
    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    // トップページのキャッシュを再検証（予約情報の更新を反映）
    revalidatePath("/");

    // 成功レスポンスを返却
    return NextResponse.json({ success: true });
  } catch (error) {
    // 予期しない例外が発生した場合のエラーハンドリング
    console.error("Reservation deletion error:", error);

    return NextResponse.json(
      { error: "削除に失敗しました。再度お試しください。" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
