"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { UserIcon, ChevronDown, LogOut, CheckCircle } from "lucide-react";
import { config } from "@/lib/Web3Provider";

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  const getChainName = (id: number) => {
    const chain = config.chains.find((c) => c.id === id);
    return chain ? chain.name : "Unknown Network";
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>{getChainName(chainId)}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
            <DropdownMenuGroup>
              {chains.map((chain) => (
                <DropdownMenuItem
                  key={chain.id}
                  onClick={() => switchChain({ chainId: chain.id })}
                  disabled={chainId === chain.id}
                  className="flex justify-between items-center"
                >
                  <span>{chain.name}</span>
                  {chainId === chain.id && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => disconnect()}
              className="text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </Button>
  );
}
