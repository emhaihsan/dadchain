"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, Home, PlusCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicConnectWalletButton = dynamic(
  () => import("./ConnectWalletButton").then((mod) => mod.ConnectWalletButton),
  { ssr: false }
);

export function Header() {
  const { isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            {isClient && (
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                >
                  Home
                </Link>

                <Link
                  href={isConnected ? "/submit" : "#"}
                  passHref
                  aria-disabled={!isConnected}
                  tabIndex={!isConnected ? -1 : undefined}
                >
                  <Button
                    size="lg"
                    className="rounded-full font-bold shadow-lg bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105"
                    disabled={!isConnected}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Submit a Joke
                  </Button>
                </Link>

                <Link
                  href="/leaderboard"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                >
                  Leaderboard
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center">
            {isClient ? (
              <DynamicConnectWalletButton />
            ) : (
              <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
