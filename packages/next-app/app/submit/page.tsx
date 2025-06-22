"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/header";
import { JokeSubmissionForm } from "@/components/joke-submission-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { motion } from "framer-motion";

export default function SubmitJokePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.main
        className="container mx-auto max-w-2xl px-4 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Submit Your Best Dad Joke
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <JokeSubmissionForm />
            ) : (
              <div className="text-center space-y-4 py-8">
                <p className="text-lg text-gray-600">
                  Please connect your wallet to submit a joke.
                </p>
                <ConnectWalletButton />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
}
