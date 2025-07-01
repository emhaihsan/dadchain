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
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/lib/Web3Provider";
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
  imageURI?: string;
}

export function TimelineFeed() {
  const { address } = useAccount();
  const [jokes, setJokes] = useState<FormattedJoke[]>([]);
  const [isTipping, setIsTipping] = useState<string | null>(null); // Use joke ID to track tipping state
  const [tippingMessage, setTippingMessage] = useState<string>("");

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
  const { writeContractAsync } = useWriteContract();

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
          imageURI: joke.imageURI,
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

    writeContractAsync(
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
    if (isTipping) return; // Prevent multiple tips at once

    const tipAmountStr = prompt("Enter amount in USDC to tip (e.g., 0.1):");
    if (
      !tipAmountStr ||
      isNaN(parseFloat(tipAmountStr)) ||
      parseFloat(tipAmountStr) <= 0
    ) {
      alert("Invalid or zero amount.");
      return;
    }

    const tipAmount = parseUnits(tipAmountStr, 6); // USDC has 6 decimals

    setIsTipping(jokeId);
    try {
      // Step 1: Approve the DadChainCore contract to spend USDC
      setTippingMessage("Waiting for approval...");
      const approveTxHash = await writeContractAsync({
        ...usdcContract,
        functionName: "approve",
        args: [dadChainCoreContract.address, tipAmount],
      });

      // Step 2: Wait for the approval transaction to be mined
      setTippingMessage("Processing approval...");
      await waitForTransactionReceipt(config, {
        hash: approveTxHash,
      });

      // Step 3: Call the actual tipJoke function
      setTippingMessage("Sending tip...");
      const tipTxHash = await writeContractAsync({
        ...dadChainCoreContract,
        functionName: "tipJoke",
        args: [BigInt(jokeId), tipAmount],
      });

      // Step 4: Wait for the tip transaction to be mined
      setTippingMessage("Finalizing tip...");
      await waitForTransactionReceipt(config, {
        hash: tipTxHash,
      });

      alert("Tip sent successfully!");
      refetchJokes(); // Refresh the feed to show the new tip amount
    } catch (error: any) {
      console.error("Tipping failed:", error);
      alert(`Tipping failed: ${error.shortMessage || error.message}`);
    } finally {
      // Reset state regardless of success or failure
      setIsTipping(null);
      setTippingMessage("");
    }
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
                    href={`https://sepolia.basescan.org/address/${joke.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline flex items-center space-x-1"
                    title="View on Basescan"
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
              {joke.imageURI && joke.imageURI.startsWith("ipfs://") && (
                <div className="mt-4 relative aspect-video">
                  <Image
                    src={joke.imageURI.replace(
                      "ipfs://",
                      "https://gateway.pinata.cloud/ipfs/"
                    )}
                    alt={`Image for joke ${joke.id}`}
                    layout="fill"
                  />
                </div>
              )}
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
              {isTipping === joke.id && tippingMessage && (
                <p className="text-sm text-blue-600 ml-4 animate-pulse">
                  {tippingMessage}
                </p>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
