import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function Splash() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if splash has been shown
    const hasSeenSplash = localStorage.getItem("auradia_splash_shown");
    
    if (hasSeenSplash) {
      // Skip splash, go directly to home
      navigate(createPageUrl("Home"), { replace: true });
      return;
    }

    // Mark splash as shown
    localStorage.setItem("auradia_splash_shown", "true");

    // Auto-navigate after 6 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        navigate(createPageUrl("Home"), { replace: true });
      }, 500);
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: show ? 1 : 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 flex items-center justify-center overflow-hidden"
    >
      {/* Floating blobs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br blur-3xl ${
            i === 0 ? "from-purple-300/40 to-pink-200/30 w-72 h-72 -top-20 -left-20" :
            i === 1 ? "from-blue-200/30 to-cyan-200/20 w-96 h-96 -bottom-32 -right-20" :
            i === 2 ? "from-pink-200/30 to-rose-100/20 w-64 h-64 top-1/3 -right-16" :
            "from-violet-200/25 to-purple-100/15 w-80 h-80 bottom-1/4 -left-24"
          }`}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: i * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sparkle particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
          style={{
            left: `${20 + i * 10}%`,
            top: `${15 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with glow animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 40px rgba(168, 85, 247, 0.3)",
                "0 0 80px rgba(168, 85, 247, 0.5)",
                "0 0 40px rgba(168, 85, 247, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
          >
            <span className="text-4xl">🌙</span>
          </motion.div>
          
          {/* Expanding halo */}
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-purple-300/50"
          />
        </motion.div>

        {/* App name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Auradia
        </motion.h1>

        {/* Tagline with letter stagger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="overflow-hidden"
        >
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-sm text-gray-600"
          >
            Your quiet space within.
          </motion.p>
        </motion.div>

        {/* Breathing pulse indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
          className="mt-8 w-2 h-2 rounded-full bg-purple-400"
        />
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-200/30 to-transparent pointer-events-none" />
    </motion.div>
  );
}