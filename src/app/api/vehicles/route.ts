import { NextResponse } from "next/server";
import { getVehicles } from "@/lib/data.ts";

/**
 * GET /api/vehicles
 * 車両一覧データを取得するAPIエンドポイント
 * - 正常時: 車両データ配列をJSONで返す
 * - エラー時: エラーメッセージと500ステータスを返す
 */
export async function GET() {
  try {
    // 車両データを取得
    const vehicles = await getVehicles();

    // 取得したデータをJSONで返却
    return NextResponse.json(vehicles);
  } catch (error) {
    // エラー発生時はログ出力し、エラーレスポンスを返却
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "車両データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
