"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { motion } from "framer-motion";
import { JokeSubmissionForm } from "@/components/joke-submission-form";

export default function SubmitJokePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.main
        className="container mx-auto max-w-2xl px-4 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Submit a Dad Joke
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isConnected ? (
              <JokeSubmissionForm />
            ) : (
              <div className="text-center py-8">
                <div className="mb-4 text-gray-600">
                  Connect your wallet to submit a joke
                </div>
                <ConnectWalletButton />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
}
