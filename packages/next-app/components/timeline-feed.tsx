"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, ExternalLink, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Identicon } from "./identicon";
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { dadChainCoreContract, usdcContract } from "@/lib/contracts";
import { formatUnits, parseUnits } from "viem";

// Define the structure of a formatted joke for use in the component
interface FormattedJoke {
  id: string;
  text: string;
  creator: string;
  timestamp: Date;
  likes: number;
  totalTips: string;
}

export function TimelineFeed() {
  const { address } = useAccount();
  const [jokes, setJokes] = useState<FormattedJoke[]>([]);
  const [isTipping, setIsTipping] = useState<string | null>(null); // Use joke ID to track tipping state

  // Fetch jokes using wagmi's useReadContract hook
  const {
    data: rawJokes,
    isLoading,
    isError,
    refetch: refetchJokes, // Add refetch function
  } = useReadContract({
    ...dadChainCoreContract,
    functionName: "getJokesPaginated",
    args: [BigInt(0), BigInt(20)], // Use BigInt for contract arguments
  });

  // useWriteContract hook for liking a joke
  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (rawJokes) {
      const formattedJokes = (rawJokes as any[])
        .filter((joke: any) => joke.id > 0) // Filter out empty/placeholder jokes
        .map((joke: any) => ({
          id: joke.id.toString(),
          text: joke.content,
          creator: joke.creator,
          timestamp: new Date(Number(joke.timestamp) * 1000), // Convert BigInt to Number then to Date
          likes: Number(joke.likeCount),
          totalTips: formatUnits(joke.tipAmount, 6), // Corrected: USDC has 6 decimals
        }));
      setJokes(formattedJokes);
    }
  }, [rawJokes]);

  const handleLike = (jokeId: string) => {
    if (!address) {
      alert("Please connect your wallet to like a joke.");
      return;
    }

    // Optimistic UI Update
    setJokes((currentJokes) =>
      currentJokes.map((j) =>
        j.id === jokeId ? { ...j, likes: j.likes + 1 } : j
      )
    );

    writeContract(
      {
        ...dadChainCoreContract,
        functionName: "likeJoke",
        args: [BigInt(jokeId)],
      },
      {
        onSuccess: (txHash) => {
          console.log("Like transaction sent:", txHash);
          // You can use useWaitForTransactionReceipt for more robust UI updates
        },
        onError: (error) => {
          console.error("Failed to like joke:", error);
          alert(`Error liking joke: ${error.message}`);
          // Revert optimistic update on error
          setJokes((currentJokes) =>
            currentJokes.map((j) =>
              j.id === jokeId ? { ...j, likes: j.likes - 1 } : j
            )
          );
        },
      }
    );
  };

  const handleTip = async (jokeId: string) => {
    if (!address) {
      alert("Please connect your wallet to tip a joke.");
      return;
    }

    const tipAmountStr = prompt("Enter amount in USDC to tip (e.g., 0.1):");
    if (!tipAmountStr || isNaN(parseFloat(tipAmountStr))) {
      alert("Invalid amount.");
      return;
    }

    const tipAmount = parseUnits(tipAmountStr, 6); // USDC has 6 decimals

    setIsTipping(jokeId);

    // Step 1: Approve the DadChainCore contract to spend USDC
    writeContract(
      {
        ...usdcContract,
        functionName: "approve",
        args: [dadChainCoreContract.address, tipAmount],
      },
      {
        onSuccess: (approveTxHash) => {
          console.log("USDC approval successful, tx hash:", approveTxHash);
          // Step 2: Call the actual tipJoke function
          // It's recommended to wait for the approval transaction to be mined
          // For simplicity here, we proceed directly. For production, use useWaitForTransactionReceipt.
          writeContract(
            {
              ...dadChainCoreContract,
              functionName: "tipJoke",
              args: [BigInt(jokeId), tipAmount],
            },
            {
              onSuccess: (tipTxHash) => {
                console.log("Tip successful, tx hash:", tipTxHash);
                alert("Thank you for the tip!");
                refetchJokes(); // Refetch jokes to show updated tip amount
              },
              onError: (error) => {
                console.error("Tipping failed:", error);
                alert(`Tipping failed: ${error.message}`);
              },
              onSettled: () => {
                setIsTipping(null);
              },
            }
          );
        },
        onError: (error) => {
          console.error("USDC approval failed:", error);
          alert(`USDC approval failed: ${error.message}`);
          setIsTipping(null);
        },
      }
    );
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    alert("Address copied!");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 px-2">
        Fresh Jokes from the Chain
      </h2>

      {isLoading && (
        <p className="text-center text-gray-500 py-8">Loading jokes...</p>
      )}
      {isError && (
        <p className="text-center text-red-500 py-8">
          Failed to load jokes. Please try again.
        </p>
      )}
      {!isLoading && !isError && jokes.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No jokes submitted yet. Be the first!
        </p>
      )}

      {jokes.map((joke) => {
        const isOwnJoke =
          address && joke.creator.toLowerCase() === address.toLowerCase();

        return (
          <Card
            key={joke.id}
            className="border-orange-100 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-start space-x-4 p-4">
              <Identicon address={joke.creator} size={48} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {joke.creator.slice(0, 6)}...{joke.creator.slice(-4)}
                    </span>
                    <button
                      onClick={() => copyAddress(joke.creator)}
                      title="Copy address"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-orange-600 transition-colors" />
                    </button>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${joke.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline flex items-center space-x-1"
                    title="View on Etherscan"
                  >
                    <span>
                      {formatDistanceToNow(joke.timestamp, { addSuffix: true })}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-sm text-gray-500">Verified Dad</p>
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-2">
              <p className="text-gray-800 text-base mb-3 leading-relaxed">
                {joke.text}
              </p>
            </CardContent>

            <CardFooter className="flex justify-between items-center p-4 pt-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(joke.id)}
                  disabled={isOwnJoke}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium text-sm">{joke.likes}</span>
                </button>
                <button
                  onClick={() => handleTip(joke.id)}
                  disabled={isTipping === joke.id || isOwnJoke}
                  className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium text-sm">{joke.totalTips}</span>
                </button>
              </div>
              <a
                href={`https://sepolia.etherscan.io/address/${joke.creator}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center space-x-1"
                title="View on Etherscan"
              >
                <span>
                  {formatDistanceToNow(joke.timestamp, { addSuffix: true })}
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
