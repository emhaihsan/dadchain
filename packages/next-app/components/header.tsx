"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, Trophy, User, Home } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function Header() {
  return (
    <header className="bg-white border-b border-orange-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">👨‍👧‍👦</div>
            <span className="text-xl font-bold text-gray-900">DadChain</span>
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
            <Link
              href="/profile"
              className="flex items-center space-x-1 text-gray-600 hover:text-orange-600"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
