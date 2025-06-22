"use client";

import { Header } from "@/components/header";
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
      <Header />
      <motion.main
        className="container mx-auto max-w-3xl px-4 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <TimelineFeed />
        </motion.div>

        <motion.div className="mt-16" variants={itemVariants}>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3">
              <Info className="h-6 w-6 text-orange-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                About DadChain
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The world's first decentralized platform for sharing, rating, and
              monetizing the punniest dad jokes. The best jokes are decided by
              the community.
            </p>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
