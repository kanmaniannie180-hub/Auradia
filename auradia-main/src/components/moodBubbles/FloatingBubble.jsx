import { motion } from "framer-motion";
import { useState } from "react";
import { EMOTION_EMOJIS } from "@/components/shared/MoodOrb";
import moment from "moment";

const EMOTION_SOLID = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

export default function FloatingBubble({ mood, index, isRecent, onClick, isSelected }) {
  const size = 28 + mood.intensity * 12; // 40px to 88px
  const color = EMOTION_SOLID[mood.emotion] || "#a78bfa";

  // Deterministic but varied positions based on index
  const seed = index * 137.508;
  const x = 5 + ((seed * 31) % 80); // 5% to 85%
  const y = 8 + ((seed * 17) % 70); // 8% to 78%
  const driftX = ((index % 5) - 2) * 12;
  const driftY = ((index % 3) - 1) * 10;
  const duration = 6 + (index % 4) * 2;
  const delay = (index % 6) * 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isRecent ? 1 : 0.55, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.08, type: "spring", stiffness: 200 }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        zIndex: isSelected ? 20 : 10,
      }}
      className="cursor-pointer"
      onClick={() => onClick(mood)}
    >
      {/* Floating drift animation */}
      <motion.div
        animate={{ x: [0, driftX, -driftX * 0.5, 0], y: [0, driftY, -driftY * 0.6, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Glow ring */}
        {isRecent && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: color, opacity: 0.25, filter: "blur(8px)", transform: "scale(1.4)" }}
            animate={{ scale: [1.4, 1.6, 1.4], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {/* Bubble */}
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}88)`,
            boxShadow: isSelected
              ? `0 0 0 3px white, 0 0 24px ${color}88`
              : `0 4px 16px ${color}44`,
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          animate={isSelected ? { scale: [1, 1.08, 1] } : {}}
          transition={isSelected ? { duration: 1.5, repeat: Infinity } : {}}
        >
          {/* Shine */}
          <div className="absolute top-1.5 left-2 w-2 h-1.5 rounded-full bg-white/50" />
          <span style={{ fontSize: size * 0.35 }}>{EMOTION_EMOJIS[mood.emotion] || "😶"}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}