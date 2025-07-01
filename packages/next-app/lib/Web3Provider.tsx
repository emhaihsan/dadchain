"use client";

import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask } from "wagmi/connectors";

// 1. Create a QueryClient
const queryClient = new QueryClient();

// 2. Create a Wagmi config
export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "DadJokes DApp",
        url: typeof window !== "undefined" ? window.location.host : "",
      },
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

// 3. Create a provider component
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
