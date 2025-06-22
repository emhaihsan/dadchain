"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wallet, Trophy, User, Home } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useAccount } from "wagmi";

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="bg-white border-b border-orange-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/dadchain.png"
              alt="DadChain Logo"
              width={64}
              height={64}
            />
          </Link>

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
            {isConnected && (
              <Link
                href="/profile"
                className="flex items-center space-x-1 text-gray-600 hover:text-orange-600"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
