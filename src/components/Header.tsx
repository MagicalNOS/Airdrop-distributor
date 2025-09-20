// components/Header.tsx
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full p-4 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* GitHub 图标链接 */}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaGithub className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold text-gray-800">T-Sender</h1>
        </div>
        
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}