"use client";

import { TimelineFeed } from "@/components/timeline-feed";
import { Info, MessageSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="container mx-auto max-w-5xl px-4 py-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600 mb-4">
            DadChain
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <TimelineFeed />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="backdrop-blur-lg bg-white/70 p-6 rounded-xl border border-white/20 shadow-lg">
              <p className="text-gray-600 mb-4">
                DadChain is decentralized platform for dad jokes on the
                blockchain. Submit your best dad jokes, earn likes, and get
                tipped in crypto!
              </p>
              <p className="text-gray-600">
                Connect your wallet to submit jokes and participate in the
                community.
              </p>
            </div>

            <div className="backdrop-blur-lg bg-white/70 p-6 rounded-xl border border-white/20 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
                How It Works
              </h2>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                    1
                  </span>
                  <span>Connect your MetaMask wallet</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                    2
                  </span>
                  <span>Submit your best dad jokes</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                    3
                  </span>
                  <span>Earn likes and USDC tips</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                    4
                  </span>
                  <span>Claim NFT badges as you level up</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>

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
