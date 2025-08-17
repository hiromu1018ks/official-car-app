import { LucideIcon } from "lucide-react";

/**
 * 車両情報を表すインターフェース
 */
export interface Vehicle {
  id: string; // 車両ID
  licensePlate: string; // ナンバープレート
  make: string; // メーカー名
  model: string; // モデル名
  year: number; // 年式
  status: "available" | "in-use" | "maintenance"; // 現在の状態
  currentUser?: string; // 現在使用中のユーザー（任意）
  nextInspection: string; // 次回点検日（ISO形式などの文字列）
  icon: LucideIcon; // 車両を表すアイコンコンポーネント
  iconColorFrom: string; // アイコンのグラデーション開始色
  iconColorTo: string; // アイコンのグラデーション終了色
}

/**
 * 車両の状態を表す型
 */
export type VehicleStatus = "available" | "in-use" | "maintenance";

/**
 * 各状態ごとの表示設定
 */
export interface StatusConfig {
  label: string; // 状態のラベル
  bgGradient: string; // 背景グラデーションのクラス
  textColor: string; // テキストカラーのクラス
  buttonDisabled: boolean; // ボタンの無効化状態
}
