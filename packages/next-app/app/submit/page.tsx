"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { motion } from "framer-motion";
import { JokeSubmissionForm } from "@/components/joke-submission-form";
import { Lightbulb } from "lucide-react";

export default function SubmitJokePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.main
        className="container mx-auto max-w-2xl px-4 py-10 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600 mb-4">
            Submit Your Dad Joke
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Share your best dad joke with the community and earn likes and tips!
          </p>
        </motion.div>

        <Card className="backdrop-blur-lg bg-white/70 border border-white/20 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-orange-50/50 to-purple-50/50">
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600">
              Create New Joke
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isConnected ? (
              <JokeSubmissionForm />
            ) : (
              <div className="text-center py-8">
                <div className="mb-6 text-gray-600 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <Lightbulb className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-lg mb-2">
                    Connect your wallet to submit a joke
                  </p>
                  <p className="text-sm text-gray-500 max-w-sm">
                    You'll need to connect your MetaMask wallet to submit jokes,
                    earn likes, and receive tips.
                  </p>
                </div>
                <ConnectWalletButton />
              </div>
            )}
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 backdrop-blur-lg bg-white/70 p-4 rounded-xl border border-white/20 shadow-sm"
        >
          <div className="flex items-start">
            <div className="bg-orange-100 p-2 rounded-full mr-3">
              <Lightbulb className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Pro Tip</h3>
              <p className="text-sm text-gray-600">
                The best dad jokes are short, punny, and make everyone groan.
                Keep it family-friendly!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.main>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
