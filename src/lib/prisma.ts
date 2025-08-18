import { withAccelerate } from "@prisma/extension-accelerate";
// Prismaクライアントを独自出力先からインポート（拡張子.jsが必要）
import { PrismaClient } from "../generated/prisma/index.js";

// グローバルオブジェクトに型情報を付与
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// 開発環境ではシングルトンでPrismaClientを使い回す
const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

// 開発環境ではグローバルにインスタンスを保存（ホットリロード対策）
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prismaクライアントをエクスポート
export default prisma;
