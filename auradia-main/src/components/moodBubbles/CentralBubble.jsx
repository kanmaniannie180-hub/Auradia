import { motion, AnimatePresence } from "framer-motion";
import { EMOTION_EMOJIS } from "@/components/shared/MoodOrb";

const EMOTION_SOLID = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

const INTENSITY_LABELS = ["", "Barely", "Mildly", "Quite", "Very", "Deeply"];

export default function CentralBubble({ emotion, intensity }) {
  const color = EMOTION_SOLID[emotion] || "#a78bfa";
  const baseSize = 110;
  const size = baseSize + intensity * 24; // 134px to 230px
  const glowStrength = 0.3 + intensity * 0.14; // more glow at higher intensity

  return (
    <AnimatePresence mode="wait">
      {emotion && (
        <motion.div
          key={emotion}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="flex flex-col items-center gap-3 pointer-events-none"
        >
          {/* Outer glow rings */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size + i * 28,
                height: size + i * 28,
                background: `${color}${Math.round((0.12 - i * 0.03) * 255).toString(16).padStart(2, "0")}`,
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
          ))}

          {/* Main bubble */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
            style={{ width: size, height: size }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${color}ff, ${color}aa)`,
                boxShadow: `0 12px ${20 + intensity * 12}px ${color}${Math.round(glowStrength * 255).toString(16).padStart(2,'0')}, 0 0 0 2px ${color}33`,
              }}
            >
              {/* Shine effect */}
              <div className="absolute top-4 left-5 w-6 h-4 rounded-full bg-white/40" />
              <div className="absolute top-2 left-3 w-3 h-2 rounded-full bg-white/60" />
              <span style={{ fontSize: size * 0.38 }}>
                {EMOTION_EMOJIS[emotion] || "😶"}
              </span>
            </div>
          </motion.div>

          <div className="relative z-10 text-center mt-1">
            <p className="text-sm font-bold text-gray-700 capitalize">{INTENSITY_LABELS[intensity]} {emotion}</p>
            <p className="text-xs text-gray-400">Intensity {intensity}/5</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}