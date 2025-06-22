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
import {
  UserIcon,
  ChevronDown,
  LogOut,
  CheckCircle,
  User,
  Network,
} from "lucide-react";
import { config } from "@/lib/Web3Provider";
import { Identicon } from "./identicon";
import Link from "next/link";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 pr-2">
            <Identicon address={address!} size={24} />
            <span className="font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <Link href="/profile" passHref>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            <span>Network</span>
          </DropdownMenuLabel>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => disconnect()}
            className="text-red-500 focus:text-red-500 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </Button>
  );
}
