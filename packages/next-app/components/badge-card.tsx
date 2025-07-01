"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { dadChainCoreContract } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Tipe untuk prop badge
type BadgeProps = {
  id: number;
  name: string;
  description: string;
  image: string;
  requiredJokeCount: number;
  userJokeCount: number;
  onSuccess?: () => void;
};

export function BadgeCard({
  id,
  name,
  description,
  image,
  requiredJokeCount,
  userJokeCount,
  onSuccess,
}: BadgeProps) {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Cek apakah pengguna sudah mengklaim badge ini
  const { data: hasClaimed, isLoading: isLoadingClaimStatus } = useReadContract(
    {
      ...dadChainCoreContract,
      functionName: "hasUserClaimedBadge",
      args: [address!, BigInt(id)],
      query: {
        // Hanya jalankan query jika alamat tersedia
        enabled: !!address,
      },
    }
  );

  const handleClaim = () => {
    writeContract({
      ...dadChainCoreContract,
      functionName: "claimBadge",
      args: [BigInt(id)],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success(`Badge "${name}" claimed successfully!`);
      if (onSuccess) onSuccess();
    }
    if (error) {
      const errorMessage = error.message.includes("User rejected the request")
        ? "Transaction rejected by user."
        : error.message || "Failed to claim badge.";
      toast.error(errorMessage);
    }
  }, [isConfirmed, error, name, onSuccess]);

  // Cek apakah pengguna memenuhi syarat untuk badge ini
  const isEligible = userJokeCount >= requiredJokeCount;

  // Hitung berapa joke lagi yang dibutuhkan
  const jokesNeeded = requiredJokeCount - userJokeCount;

  const renderButton = () => {
    if (isLoadingClaimStatus) {
      return (
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking Status...
        </Button>
      );
    }

    if (hasClaimed) {
      return (
        <Button disabled variant="secondary" className="w-full">
          Already Claimed
        </Button>
      );
    }

    if (isEligible) {
      return (
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={handleClaim}
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            "Claim Badge"
          )}
        </Button>
      );
    }

    return (
      <Button disabled variant="outline" className="w-full cursor-not-allowed">
        {`Submit ${jokesNeeded} more ${jokesNeeded === 1 ? "joke" : "jokes"}`}
      </Button>
    );
  };

  return (
    <Card
      className={`flex flex-col justify-between transition-all ${
        hasClaimed
          ? "bg-gray-100 border-gray-200"
          : isEligible
          ? "border-green-300"
          : "bg-white"
      }`}
    >
      <CardHeader className="flex-row items-center gap-4 p-4">
        <Image
          src={image}
          alt={name}
          width={60}
          height={60}
          className="rounded-md"
        />
        <div className="flex-1">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="p-4">{renderButton()}</CardFooter>
    </Card>
  );
}
