"use client";

import { TimelineFeed } from "@/components/timeline-feed";
import { Info } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto max-w-4xl px-4 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <TimelineFeed />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5" />
                About DadChain
              </h2>
              <p className="text-gray-600 mb-4">
                DadChain is the first decentralized platform for dad jokes on
                the blockchain. Submit your best dad jokes, earn likes, and get
                tipped in crypto!
              </p>
              <p className="text-gray-600">
                Connect your wallet to submit jokes and participate in the
                community.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
