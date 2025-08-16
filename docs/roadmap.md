# Next.js フルスタック開発学習ロードマップ (要約版)

## 1. 概要
Next.js (App Router) を中心とした最新技術を使い、「公用車管理アプリ」を開発しながらフルスタック開発の基礎を学ぶためのロードマップです。

---

## 2. 技術スタック

| カテゴリ | 技術名 |
| :--- | :--- |
| フレームワーク | Next.js (App Router) |
| データベース | PostgreSQL & Prisma |
| スタイリング | Tailwind CSS & shadcn/ui |
| フォーム | React Hook Form & Zod |
| 認証 | NextAuth.js |
| デプロイ | Vercel |

---

## 3. 学習ロードマップ (全7ステップ)

### Step 1: プロジェクトセットアップと基本レイアウト
**🎯 目標:** Next.jsとTailwind CSSでプロジェクトを立ち上げ、App Routerの基本構造を理解する。

- **学習内容:** `create-next-app`, App Router (`layout.tsx`, `page.tsx`), Tailwind CSS

### Step 2: DB接続とデータ表示
**🎯 目標:** Prismaを使いPostgreSQLに接続し、Server ComponentsでDBから取得したデータを表示する。

- **学習内容:** Prisma (スキーマ定義, マイグレーション), Server Components, `async/await`

### Step 3: データ登録
**🎯 目標:** Server Actionsを使い、フォームから入力されたデータをDBに登録する。

- **学習内容:** Server Actions, `revalidatePath`, React Hook Form, Zod

### Step 4: データ更新・削除
**🎯 目標:** 動的ルーティングで詳細ページを作り、データの更新・削除機能を実装する。

- **学習内容:** 動的ルーティング (`[id]`), CRUD, `redirect`

### Step 5: クライアントでの状態管理
**🎯 目標:** Client Componentsを使い、インタラクティブなUIを構築。クライアントの状態をZustandで管理する。

- **学習内容:** Client Components (`'use client'`), Zustand

### Step 6: 認証
**🎯 目標:** NextAuth.jsを導入し、ログイン機能とアクセス制御を実装する。

- **学習内容:** NextAuth.js, OAuth, セッション管理

### Step 7: テストとデプロイ
**🎯 目標:** アプリケーションのテストを書き、Vercelにデプロイして公開する。

- **学習内容:** Jest/Vitest, Vercel, CI/CD

---

## 4. 心構え
- 完璧よりまず完成を目指す。
- エラーメッセージをヒントに解決する。
- 公式ドキュメントを信頼する。
- 学んだことをアウトプットする。