import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

function getInsight(moods) {
  if (!moods || moods.length < 3) return null;
  const neg = ["sad", "stressed", "angry", "anxious"];
  const negCount = moods.slice(0, 5).filter(m => neg.includes(m.emotion)).length;
  const eveningStress = moods.filter(m => (m.day_period === "evening" || m.day_period === "night") && neg.includes(m.emotion)).length;
  if (eveningStress > 2) return { text: "Evenings tend to show higher stress for you", emoji: "🌙" };
  if (negCount === 0) return { text: "You've been in a positive flow lately", emoji: "✨" };
  if (negCount >= 3) return { text: "Breathing exercises may help during tough moments", emoji: "🧘" };
  return { text: "Journaling often follows calmer moods for you", emoji: "📖" };
}

export default function InsightChip({ moods }) {
  const insight = getInsight(moods);
  if (!insight) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.52, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.25 } }}
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-purple-50/70 backdrop-blur-sm border border-purple-100/60"
      style={{ boxShadow: "0 2px 12px rgba(139,92,246,0.07)" }}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"
      >
        <TrendingUp className="w-4 h-4 text-purple-500" />
      </motion.div>
      <div>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-0.5"
        >
          Weekly Insight
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.35 }}
          className="text-xs text-purple-700 leading-snug"
        >
          {insight.emoji} {insight.text}
        </motion.p>
      </div>
    </motion.div>
  );
}