import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EMOTION_COLORS = {
  happy: "from-yellow-300 to-amber-400",
  calm: "from-sky-300 to-blue-400",
  neutral: "from-slate-300 to-gray-400",
  sad: "from-indigo-300 to-purple-400",
  stressed: "from-rose-300 to-red-400",
  angry: "from-red-400 to-orange-500",
  anxious: "from-violet-300 to-purple-500",
  tired: "from-blue-200 to-slate-400",
  excited: "from-pink-300 to-rose-400",
  grateful: "from-teal-300 to-emerald-400",
};

const EMOTION_EMOJIS = {
  happy: "😊", calm: "😌", neutral: "😐", sad: "😢",
  stressed: "😰", angry: "😤", anxious: "😟", tired: "😴",
  excited: "🤩", grateful: "🙏",
};

export default function MoodOrb({ emotion, intensity = 3, size = "md", showLabel = true, onClick }) {
  const gradient = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;
  const emoji = EMOTION_EMOJIS[emotion] || "😐";
  const sizes = { sm: "w-12 h-12", md: "w-20 h-20", lg: "w-28 h-28", xl: "w-36 h-36" };
  const orbSize = sizes[size] || sizes.md;
  const glowIntensity = 10 + intensity * 8;

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileTap={onClick ? { scale: 0.92 } : undefined}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          "rounded-full bg-gradient-to-br flex items-center justify-center",
          gradient, orbSize,
          onClick && "cursor-pointer"
        )}
        style={{ boxShadow: `0 0 ${glowIntensity}px rgba(168, 85, 247, 0.3)` }}
        animate={{
          scale: [1, 1.04, 1],
          boxShadow: [
            `0 0 ${glowIntensity}px rgba(168, 85, 247, 0.2)`,
            `0 0 ${glowIntensity + 15}px rgba(168, 85, 247, 0.4)`,
            `0 0 ${glowIntensity}px rgba(168, 85, 247, 0.2)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className={cn(
          size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : size === "xl" ? "text-5xl" : "text-2xl"
        )}>{emoji}</span>
      </motion.div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-600 capitalize">{emotion}</span>
      )}
    </motion.div>
  );
}

export { EMOTION_COLORS, EMOTION_EMOJIS };