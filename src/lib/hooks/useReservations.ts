"use client";

import { useEffect, useState } from "react";

/**
 * 予約データと関連する車両・ユーザー情報を含むオブジェクトの型定義
 * APIから取得される予約データの完全な構造を表現
 */
export interface ReservationWithDetails {
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

/**
 * 予約データを管理するカスタムフック
 *
 * 機能:
 * - 予約一覧の取得と状態管理
 * - ローディング状態の管理
 * - エラーハンドリング
 * - データの再取得機能
 *
 * 使用例:
 * ```tsx
 * const { reservations, loading, error, refetch } = useReservations();
 * ```
 *
 * @returns 予約データ、ローディング状態、エラー情報、再取得関数を含むオブジェクト
 */
export function useReservations() {
  // 予約データ配列の状態管理（初期値は空配列）
  const [reservations, setReservations] = useState<ReservationWithDetails[]>(
    []
  );

  // ローディング状態の管理（初期値はtrue：マウント時に自動取得するため）
  const [loading, setLoading] = useState(true);

  // エラー状態の管理（エラーメッセージまたはnull）
  const [error, setError] = useState<string | null>(null);

  /**
   * 予約データをAPIから取得する非同期関数
   *
   * 処理フロー:
   * 1. ローディング状態をtrueに設定
   * 2. APIエンドポイント（/api/reservations）にGETリクエスト
   * 3. レスポンスの成功確認
   * 4. JSONデータの型キャストと状態更新
   * 5. エラーハンドリング
   * 6. ローディング状態をfalseに設定
   */
  const fetchReservations = async () => {
    try {
      // ローディング開始（再取得時のUI表示用）
      setLoading(true);

      // 予約一覧APIにリクエスト送信
      const response = await fetch("/api/reservations");

      // HTTPエラーレスポンスのチェック
      if (!response.ok) throw new Error("Failed to fetch reservations");

      // レスポンスJSONを型安全に取得
      const data = (await response.json()) as ReservationWithDetails[];

      // 取得したデータで状態を更新
      setReservations(data);
    } catch (error) {
      // エラー時のメッセージ設定（型安全なエラーハンドリング）
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      // 成功・失敗に関わらずローディング状態を終了
      setLoading(false);
    }
  };

  // コンポーネントマウント時に予約データを自動取得
  useEffect(() => {
    void fetchReservations(); // Promise を明示的に無視（非同期実行）
  }, []); // 依存配列が空なので初回のみ実行

  // フックの戻り値：呼び出し元で使用する値と関数
  return {
    reservations, // 予約データ配列
    loading, // ローディング状態
    error, // エラーメッセージ
    refetch: fetchReservations, // データ再取得関数（refetchという名前でエクスポート）
  };
}
