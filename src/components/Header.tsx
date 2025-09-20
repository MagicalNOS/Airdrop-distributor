// components/Header.tsx
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGift } from "react-icons/fa"; // 使用礼物图标作为空投图标

export default function Header() {
  return (
    <header className="w-full p-4 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* 空投图标 */}
          <div className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
            <FaGift className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Airdrop Distributor</h1>
        </div>
        
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}