import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma.ts";
import { reservationSchema } from "@/lib/schemas/reservation.ts";

/**
 * 予約作成APIエンドポイント（POST /api/reservations）
 *
 * 処理フロー:
 * 1. リクエストボディの取得・型付け
 * 2. 入力値のバリデーション（Zodスキーマ利用）
 * 3. 予約の重複チェック（同一車両・時間帯）
 * 4. 予約レコードの作成
 * 5. キャッシュの再検証
 *
 * @param request - HTTPリクエストオブジェクト
 * @returns 成功時: { success: true }, エラー時: エラーメッセージとステータスコード
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
      // バリデーションエラー時は詳細なエラー情報を構築して返す
      const tree = z.treeifyError(validatedData.error);

      return NextResponse.json(
        {
          error: "入力内容を確認してください",
          details: tree.properties,
        },
        { status: 400 }
      );
    }

    // 日時文字列をISO形式に変換（データベース保存用の標準フォーマット）
    const startDateTime = new Date(
      validatedData.data.startDateTime
    ).toISOString();
    const endDateTime = new Date(validatedData.data.endDateTime).toISOString();

    // 予約の重複チェック
    // 条件: 同じ車両で、予約状態が「予定」または「進行中」で、時間帯が重複するもの
    // 重複判定: 新規予約の開始時刻 < 既存予約の終了時刻 AND 新規予約の終了時刻 > 既存予約の開始時刻
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        vehicle_id: validatedData.data.vehicleId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] }, // アクティブな予約のみ対象
        AND: [
          { start_time: { lt: endDateTime } }, // 既存予約の開始時刻 < 新規予約の終了時刻
          { end_time: { gt: startDateTime } }, // 既存予約の終了時刻 > 新規予約の開始時刻
        ],
      },
    });

    if (conflictingReservation) {
      // 重複する予約が存在する場合はConflictエラーを返す
      return NextResponse.json(
        {
          error: "この時間帯は既に予約されています",
        },
        { status: 409 } // 409 Conflict
      );
    }

    // 新規予約レコードをデータベースに作成
    await prisma.reservation.create({
      data: {
        vehicle_id: validatedData.data.vehicleId, // 車両ID
        start_time: startDateTime, // 利用開始日時（ISO文字列形式）
        end_time: endDateTime, // 利用終了日時（ISO文字列形式）
        destination: validatedData.data.destination, // 利用目的・行き先
        user_id: "cmeh4frya0004y9t2yp2nhnnj", // TODO: 認証機能実装後は実際のユーザーIDに変更
        status: "SCHEDULED", // 予約状態（初期値は「予定」）
      },
    });

    // トップページのキャッシュを再検証（予約情報の更新を反映）
    revalidatePath("/");

    // 成功レスポンスを返却
    return NextResponse.json({ success: true });
  } catch (error) {
    // 予期しない例外が発生した場合のエラーハンドリング
    console.error("Reservation creation error:", error);

    return NextResponse.json(
      { error: "予約に失敗しました。再度お試しください。" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

/**
 * 予約一覧取得APIエンドポイント（GET /api/reservations）
 *
 * 取得条件:
 * - 本日以降の予約のみ（過去の予約は除外）
 * - キャンセル済みの予約は除外
 * - 開始時刻の昇順でソート
 *
 * 関連データ:
 * - 車両情報（メーカー、モデル、ナンバープレート、アイコン情報）
 * - ユーザー情報（名前、メールアドレス）
 *
 * @returns 予約配列（関連データ含む）またはエラーメッセージ
 */
export async function GET() {
  try {
    // 本日0時のDateオブジェクトを作成（時分秒をリセット）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 条件に合致する予約データを関連情報と共に取得
    const reservations = await prisma.reservation.findMany({
      where: {
        start_time: { gte: today }, // 本日以降の予約のみ
        status: { not: "CANCELLED" }, // キャンセル済みは除外
      },
      include: {
        // 車両情報を含める（表示に必要な項目のみ選択）
        vehicle: {
          select: {
            make: true, // メーカー
            model: true, // モデル
            license_plate: true, // ナンバープレート
            icon: true, // アイコン名
            icon_color_from: true, // グラデーション開始色
            icon_color_to: true, // グラデーション終了色
          },
        },
        // ユーザー情報を含める（表示に必要な項目のみ選択）
        user: {
          select: {
            name: true, // ユーザー名
            email: true, // メールアドレス
          },
        },
      },
      orderBy: { start_time: "asc" }, // 開始時刻の昇順でソート
    });

    // 取得した予約データ配列を返却
    return NextResponse.json(reservations);
  } catch (error) {
    // データベースアクセスエラーなどの例外処理
    console.error("Failed to fetch reservations:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch reservations",
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
