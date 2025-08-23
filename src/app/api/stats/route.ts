import { NextResponse } from "next/server";
import { getVehicleStats } from "@/lib/data.ts";

/**
 * 統計データ取得APIエンドポイント（GET /api/stats）
 * - 車両の統計情報（総数・利用可能・使用中・点検中）を返す
 * - 正常時: 統計データをJSONで返す
 * - エラー時: エラーメッセージと500ステータスを返す
 */
export async function GET() {
  try {
    // 車両統計データを取得
    const stats = await getVehicleStats();

    // 取得した統計データをJSONで返却
    return NextResponse.json(stats);
  } catch (error) {
    // エラー発生時はログ出力し、エラーレスポンスを返却
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "統計データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
