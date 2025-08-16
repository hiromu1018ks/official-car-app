import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export const Header = () => {
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
          {/* 右側は後で実装 */}
          <div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
              新規登録
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
