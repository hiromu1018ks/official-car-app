# 公用車管理アプリ 統合開発ロードマップ v2.0

## 📋 概要

Next.js (App Router) を中心とした最新技術を使い、「公用車管理アプリ」を開発しながらフルスタック開発を学習するための**統合ロードマップ**です。基本学習から高度な予約システム実装まで段階的に進めます。

---

## 🎯 プロジェクト現状分析

### ✅ 完了済み機能（Step 5まで完了）
- **Step 1-3 完了**: Next.js + Tailwind CSS + Prisma + PostgreSQL基礎
- **Step 4 完了**: 予約システムDB設計・バックエンド実装
- **Step 5 完了**: API Routes方式への完全移行
- 予約と運転記録の完全分離設計
- 時間重複チェック機能実装
- Reservation/ReservationStatus モデル導入
- API Routes実装（/api/vehicles, /api/stats, /api/reservations）
- 完全Client Component化（Prisma Client競合問題解決）
- TypeScript型安全性確保（アイコンシリアライゼーション対応）
- 車両一覧表示・統計表示・予約モーダル完全動作
- React Hook Form + Zod バリデーション完全実装
- フロントエンド/バックエンド責任分離完了

### 🎯 現在の状況
- **予約システム基本機能**: 完全動作（作成・バリデーション・エラーハンドリング）
- **アーキテクチャ移行**: 成功（API Routes分離型）
- **次のステップ準備**: Step 6（予約システム拡張）へ進める状態

---

## 🛠 技術スタック

| カテゴリ | 技術名 | バージョン | ステータス |
|:---|:---|:---|:---|
| フレームワーク | Next.js (App Router) | 15.4.6 | ✅ 導入済み |
| ランタイム | React | 19.1.0 | ✅ 導入済み |
| データベース | PostgreSQL & Prisma | 6.14.0 | ✅ 導入済み |
| スタイリング | Tailwind CSS & Radix UI | 4.x | ✅ 導入済み |
| フォーム | React Hook Form & Zod | 7.62.0/4.0.17 | ✅ 導入済み |
| 認証 | NextAuth.js | - | 🔄 今後導入 |
| デプロイ | Vercel | - | 🔄 今後実装 |

---

## 🗺 統合開発ロードマップ（全10ステップ）

### Phase A: 基礎学習フェーズ（完了済み）

#### ~~Step 1: プロジェクトセットアップと基本レイアウト~~ ✅
**🎯 目標:** Next.jsとTailwind CSSでプロジェクトを立ち上げ、App Routerの基本構造を理解する。

- ✅ `create-next-app`, App Router (`layout.tsx`, `page.tsx`), Tailwind CSS
- ✅ 基本コンポーネント（StatsCard, VehicleTable）実装済み

#### ~~Step 2: DB接続とデータ表示~~ ✅ 
**🎯 目標:** Prismaを使いPostgreSQLに接続し、Server ComponentsでDBから取得したデータを表示する。

- ✅ Prisma (スキーマ定義, マイグレーション), Server Components, `async/await`
- ✅ 車両・ユーザー・運転日誌テーブル設計・実装済み

#### ~~Step 3: データ登録（基本部分）~~ ✅
**🎯 目標:** Server Actionsを使い、フォームから入力されたデータをDBに登録する。

- ✅ Server Actions基本, `revalidatePath`, React Hook Form, Zod基本導入
- ⚠️ **予約システム部分は未完了**

---

### Phase B: 高度な予約システム実装フェーズ（新規）

#### ~~Step 4: 予約システム DB設計・実装~~ ✅ **完了**
**🎯 達成内容:** 予約と運転記録を分離したDB設計に移行し、適切な予約システムの基盤を構築完了。

**✅ 完了した学習内容:**
- ✅ 高度なPrisma スキーマ設計（リレーション分離）
- ✅ ReservationStatus enum設計（承認フロー簡素化）
- ✅ 時間重複チェックロジック実装
- ✅ TypeScript型定義整備
- ✅ YAGNI原則・シンプル設計思想の習得

**✅ 完了した実装:**
1. ✅ **Prismaスキーマ更新** - シンプル設計採用
   ```prisma
   enum VehicleStatus {
     AVAILABLE   // 利用可能
     IN_USE      // 使用中（予約時間内）
     MAINTENANCE // 点検中
   }
   
   enum ReservationStatus {
     SCHEDULED   // 予約済み（未開始）
     IN_PROGRESS // 利用中  
     COMPLETED   // 完了
     CANCELLED   // キャンセル
   }

   model Reservation {
     // 完全な予約システム実装済み
     // 時間重複チェック対応
     // 適切なリレーション設計
   }
   ```

2. ✅ **マイグレーション実行** - DB更新完了
3. ✅ **正しいreserveVehicleAction実装** - 時間重複チェック付き  
4. ✅ **型定義更新**（`src/types/reservation.ts`）
5. ✅ **設計思想の学習** - 実用性重視のシステム設計

**🎯 学習成果:**
- 予約システムのバックエンド基盤完成
- 実用的なDB設計思想の習得
- 複雑性を避けるシステム設計の理解

---

#### ~~Step 5: アーキテクチャ移行（API Routes方式）~~ ✅ **完了**
**🎯 達成内容:** Server/Client Component混在の複雑性を解決し、フロントエンド/バックエンド分離型アーキテクチャに完全移行完了。

**✅ 完了した学習内容:**
- ✅ Next.js API Routes設計とRESTful API実装
- ✅ フロントエンド/バックエンド責任分離アーキテクチャ
- ✅ React SPA + API連携パターンの習得
- ✅ アイコンシリアライゼーション問題の解決
- ✅ TypeScript型安全性の確保（API通信対応）

**✅ 完了した実装:**
1. ✅ **3つのAPI Routes実装**
   ```typescript
   // 📁 app/api/vehicles/route.ts - 車両データAPI
   export async function GET() {
     const vehicles = await getVehicles();
     return NextResponse.json(vehicles);
   }

   // 📁 app/api/stats/route.ts - 統計データAPI  
   export async function GET() {
     const stats = await getVehicleStats();
     return NextResponse.json(stats);
   }

   // 📁 app/api/reservations/route.ts - 予約作成API
   export async function POST(request: Request) {
     // JSON→Zodバリデーション→DB登録の完全実装
   }
   ```

2. ✅ **完全Client Component化**
   ```typescript
   // 📁 app/page.tsx, VehicleTable.tsx, ReservationModal.tsx
   "use client";
   // すべてClient Componentに移行完了
   // useState + useEffect + fetchパターンの習得
   ```

3. ✅ **Props Drilling解消**
   ```typescript
   // ReservationModal内でAPI呼び出し完結
   // 各コンポーネントの独立性確保
   ```

**🎯 学習成果:**
- ✅ Prisma Client競合エラーの完全解消
- ✅ フロントエンド/バックエンドの明確な分離
- ✅ React Hook Form + API連携の正常動作
- ✅ 責任分離とコンポーネント独立性の実現
- ✅ 型安全なAPI通信の実装

---

#### Step 6: 予約システム完成（高度なUI・リアルタイム対応）
**🎯 目標:** カレンダー形式の予約管理システムを実装し、WebSocket/SSEによるリアルタイム更新とモーダル編集機能を完成させる。

**📋 設計方針決定:**
- ✅ **表示方式:** カレンダー形式（時間帯表示対応）
- ✅ **リアルタイム更新:** WebSocket/SSE方式  
- ✅ **編集・キャンセル:** モーダル編集（既存ReservationModal流用）

**✅ 完了した学習内容:**
- ✅ カスタムReact Hook作成（useReservations）
- ✅ TypeScript完全対応（型安全なコンポーネント設計）
- ✅ アクセシビリティ対応（キーボードナビゲーション、ARIA）
- ✅ 日付計算アルゴリズム（週表示ロジック）
- ✅ 配列フィルタリング（日付による予約データの絞り込み）
- ✅ UI/UXデザイン（直感的なカレンダーインターフェース）
- 🔄 WebSocket/Server-Sent Events (SSE) によるリアルタイム通信
- 🔄 React Hook Form高度活用（編集・削除対応）
- 🔄 モーダル状態管理と再利用可能コンポーネント設計

**✅ 完了した実装:**
1. ✅ **予約データ取得API拡張** - 完了
   ```typescript
   // GET /api/reservations - カレンダー表示用データ取得
   export async function GET() {
     const today = new Date();
     today.setHours(0, 0, 0, 0);

     const reservations = await prisma.reservation.findMany({
       where: {
         start_time: { gte: today },
         status: { not: 'CANCELLED' }
       },
       include: {
         vehicle: {
           select: {
             make: true, model: true, license_plate: true,
             icon: true, icon_color_from: true, icon_color_to: true
           }
         },
         user: { select: { name: true, email: true } }
       },
       orderBy: { start_time: 'asc' }
     });
     return NextResponse.json(reservations);
   }
   ```

2. ✅ **カレンダー表示コンポーネント実装** - 完了
   ```typescript
   // ✅ useReservations.ts - データ取得フック実装済み
   // ✅ ReservationCalendar.tsx - 週表示カレンダー実装済み
   // ✅ 週ナビゲーション（前週・次週ボタン）
   // ✅ 予約ブロックの時間帯表示
   // ✅ アクセシビリティ対応（role, tabIndex, keyboard events）
   // ✅ メインページへの統合完了
   ```

3. ✅ **予約編集・削除API実装** - 完了
   ```typescript
   // PUT /api/reservations/[id] - 予約更新（自分自身除外の重複チェック付き）
   // DELETE /api/reservations/[id] - 予約削除（SCHEDULED状態のみ）
   // 動的ルーティング、バリデーション、状態チェック完全実装
   ```

4. **ReservationModal拡張** (2-3日)
   - 新規作成・編集・詳細表示モードの統合
   - 削除確認ダイアログ
   - エラーハンドリング強化

5. **WebSocket/SSE実装** (3-4日)
   ```typescript
   // /api/reservations/stream - SSEエンドポイント
   // リアルタイム予約状況更新
   // 楽観的UI更新との組み合わせ
   ```

6. **統合テスト・UI調整** (1-2日)

---

#### Step 7: データ更新・削除（予約システム拡張）
**🎯 目標:** 動的ルーティングで予約詳細ページを作り、CRUD機能を完全実装する。

**学習内容:** 
- 動的ルーティング (`[id]`), CRUD応用, `redirect`
- 予約ライフサイクル管理

**実装タスク:**
1. **予約詳細ページ** (`/reservations/[id]`) (2-3日)
2. **予約編集・削除機能**
3. **運転記録との連携機能**

---

### Phase C: 高度機能・学習フェーズ

#### Step 8: クライアントでの状態管理
**🎯 目標:** Client Componentsを使い、予約システムのインタラクティブUIを構築。クライアント状態をZustandで管理する。

**学習内容:** 
- Client Components (`'use client'`), Zustand
- リアルタイム車両状況表示
- 楽観的UI更新

**実装タスク:**
1. **リアルタイム車両状況更新** (3-4日)
2. **予約カレンダービュー**
3. **Zustandによるクライアント状態管理**

---

#### Step 9: 認証システム実装
**🎯 目標:** NextAuth.jsを導入し、ユーザー別予約管理とアクセス制御を実装する。

**学習内容:** 
- NextAuth.js, OAuth, セッション管理
- ロールベースアクセス制御
- 予約承認ワークフロー

**実装タスク:**
1. **NextAuth.js導入** (4-5日)
2. **ユーザー認証・認可**
3. **管理者・一般ユーザー権限分離**

---

#### Step 10: テストとデプロイ
**🎯 目標:** 予約システムの包括的テストを実装し、Vercelにデプロイして本番運用開始。

**学習内容:** 
- Jest/Vitest（予約ロジックのユニットテスト）
- E2Eテスト（予約フローのテスト）
- Vercel, CI/CD

**実装タスク:**
1. **予約システムテスト** (3-4日)
2. **パフォーマンス最適化**
3. **本番デプロイ**

---

## 📊 進捗管理

### 現在位置
```
Phase A: ✅✅✅ (Step 1-3 基礎完了)
Phase B: ✅✅🔄▫ (Step 4-5 完了, Step 6 予約システム拡張進行中)  ← 現在位置
Phase C: ▫▫▫ (Step 8-10 未着手)
```

**Step 6 詳細進捗:**
- ✅ 6-1: 予約データ取得API拡張 (完了)
- ✅ 6-2: カレンダー表示コンポーネント実装 (完了)
- ✅ 6-3: 予約編集・削除API実装 (完了)
- 🔄 6-4: ReservationModal拡張 (次のタスク)
- ▫ 6-5: WebSocket/SSE実装
- ▫ 6-6: 統合テスト・UI調整

### 今後の予定
- **現在進行中**: Step 6 (予約システム拡張) - 6-1, 6-2, 6-3 完了
- **次のタスク**: Step 6-4 (ReservationModal拡張)
- **来月**: Step 6-7 (予約システム完成・CRUD) 完了目標  
- **2ヶ月後**: Step 8-9 (状態管理・認証) 完了
- **3ヶ月後**: Step 10 (テスト・デプロイ) 全体完成

---

## 🔄 学習アプローチ

### 基本方針
1. **段階的実装**: 既存機能を壊さない漸進的開発
2. **実践重視**: 理論と実装を並行して学習
3. **コードレビュー**: 各ステップで品質確認
4. **ドキュメント化**: 学習内容の記録・共有

### 推奨学習リソース
- **Next.js公式ドキュメント**: https://nextjs.org/docs
- **Prisma Guide**: https://www.prisma.io/docs
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

### エラーハンドリング指針
- エラーメッセージをヒントに解決する
- 公式ドキュメントを第一に参照
- 段階的デバッグ（小さな単位で動作確認）
- 学んだことをドキュメント化

---

## 🎯 最終成果物

### 機能面
- ✅ 車両管理システム（基本機能完了）
- 🔄 高度な予約システム（時間帯管理・重複防止）
- 🔄 ユーザー認証・認可システム
- 🔄 管理者ダッシュボード
- 🔄 レポート・分析機能

### 学習面
- ✅ Next.js App Router完全理解
- ✅ Prisma ORM & PostgreSQL運用スキル
- ✅ 高度なDB設計・リレーション管理
- ✅ システム設計思想（YAGNI原則・シンプル設計）
- ✅ 時間重複チェック・バリデーションロジック
- ✅ React Hook Form + Zod 高度活用（API連携対応）
- ✅ API Routes & Client Components分離アーキテクチャ
- 🔄 認証・認可システム設計
- 🔄 テスト駆動開発・本番デプロイ経験

---

## 📚 関連ドキュメント

- [基本学習ロードマップ](./roadmap.md) - オリジナル7ステップ学習計画
- [車両予約システム改善計画](./vehicle-reservation-improvement-plan.md) - 詳細実装計画書
- [CLAUDE.md](../CLAUDE.md) - 開発ガイドライン・ツール使用方針

---

**最終更新**: 2025年8月23日（Step 6-2 完了版）  
**ロードマップバージョン**: 3.2  
**対象プロジェクト**: official-car-app v0.1.0