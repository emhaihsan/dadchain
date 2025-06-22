"use client";

import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, lineaSepolia, polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask } from "wagmi/connectors";

// 1. Create a QueryClient
const queryClient = new QueryClient();

// 2. Create a Wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia, lineaSepolia, polygonAmoy],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [lineaSepolia.id]: http(),
    [polygonAmoy.id]: http(),
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
