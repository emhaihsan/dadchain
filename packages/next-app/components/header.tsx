"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, User, Home } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useAccount } from "wagmi";

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="bg-white border-b border-orange-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="relative flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/dadchain.png"
              alt="DadChain Logo"
              width={64}
              height={64}
            />
          </Link>

          {/* Centered Navigation with Absolute Positioning */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center space-x-1 text-gray-600 hover:text-orange-600"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-1 text-gray-600 hover:text-orange-600"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href={isConnected ? "/profile" : "#"}
                className={`flex items-center space-x-1 transition-colors ${
                  isConnected
                    ? "text-gray-600 hover:text-orange-600"
                    : "text-gray-400 pointer-events-none"
                }`}
                aria-disabled={!isConnected}
                tabIndex={!isConnected ? -1 : undefined}
                suppressHydrationWarning
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
