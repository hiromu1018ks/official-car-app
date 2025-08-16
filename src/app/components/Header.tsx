"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export const Header = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="glass-effect backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* ロゴ部分 */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">
                  <Car />
                </span>
              </div>
              <h1 className="text-xl font-bold text-white">公用車管理アプリ</h1>
            </div>
          </div>
          <nav className="hidden md:ml-12 md:flex md:space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all 
                ${
                  isActive("/")
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
            >
              車両一覧
            </Link>
            <Link
              href="/reservations"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/reservations")
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              予約管理
            </Link>
            <Link
              href="/history"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/history")
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              利用履歴
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              <span className="flex items-center space-x-2">
                <span>+</span>
                <span>新規登録</span>
              </span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">田</span>
              </div>
              <span className="text-sm font-medium text-white">田中太郎</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
