import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Web3Provider } from "@/lib/Web3Provider";
import { Header } from "@/components/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DadChain - On-Chain Dad Jokes",
  description:
    "The world's first decentralized dad joke platform where puns build your on-chain reputation.",
  icons: {
    icon: "/dadchain.ico",
    shortcut: "/dadchain.png",
    apple: "/dadchain.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning={true}
      >
        <Web3Provider>
          <Header />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
