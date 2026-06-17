import { motion } from "framer-motion";
import { EMOTION_CONFIG } from "@/lib/emotionEngine";

export default function EmotionPatternCard({ patterns, entries }) {
  if (!patterns) return null;

  const cfg = EMOTION_CONFIG[patterns.dominantEmotion] || EMOTION_CONFIG.neutral;

  // Build mini timeline (last 7 entries)
  const timeline = entries.filter(e => e.detected_emotion).slice(0, 7).reverse();

  const trendEmoji = patterns.trend === "rising" ? "📈" : patterns.trend === "falling" ? "📉" : "〰️";
  const trendLabel = patterns.trend === "rising" ? "Intensity rising" : patterns.trend === "falling" ? "Settling down" : "Emotionally stable";

  const stabilityLabel = patterns.stabilityScore >= 8 ? "Very stable" : patterns.stabilityScore >= 5 ? "Moderate" : "High variance";
  const stabilityColor = patterns.stabilityScore >= 8 ? "text-emerald-600" : patterns.stabilityScore >= 5 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-4 space-y-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Pattern</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Most felt", value: cfg.label, emoji: cfg.emoji },
          { label: "Trend", value: trendLabel, emoji: trendEmoji },
          { label: "Stability", value: stabilityLabel, emoji: "🧘" },
        ].map(s => (
          <div key={s.label} className="bg-white/50 rounded-2xl p-2.5 text-center">
            <span className="text-lg block mb-0.5">{s.emoji}</span>
            <p className="text-[9px] text-gray-400 font-semibold uppercase">{s.label}</p>
            <p className={`text-[10px] font-bold mt-0.5 ${s.label === "Stability" ? stabilityColor : "text-gray-700"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mini emotion timeline */}
      {timeline.length >= 2 && (
        <div>
          <p className="text-[10px] text-gray-400 font-semibold mb-2">Recent emotional flow</p>
          <div className="flex items-end gap-1.5">
            {timeline.map((entry, i) => {
              const ecfg = EMOTION_CONFIG[entry.detected_emotion] || EMOTION_CONFIG.neutral;
              const h = 8 + (entry.intensity_score || 3) * 8;
              return (
                <motion.div key={entry.id}
                  initial={{ height: 0 }} animate={{ height: h }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                  className="flex-1 rounded-t-full relative group"
                  style={{ background: ecfg.color, minHeight: h }}
                  title={ecfg.label}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {ecfg.emoji}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-400">Older</span>
            <span className="text-[9px] text-gray-400">Recent</span>
          </div>
        </div>
      )}

      {/* Emotion distribution dots */}
      {Object.keys(patterns.emotionCounts).length > 0 && (
        <div>
          <p className="text-[10px] text-gray-400 font-semibold mb-2">Emotion distribution</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(patterns.emotionCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([em, count]) => {
                const ecfg = EMOTION_CONFIG[em] || EMOTION_CONFIG.neutral;
                const pct = Math.round((count / patterns.total) * 100);
                return (
                  <div key={em} className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/60 border border-white/70">
                    <div className="w-2 h-2 rounded-full" style={{ background: ecfg.color }} />
                    <span className="text-[10px] text-gray-600 font-medium">{ecfg.label}</span>
                    <span className="text-[10px] text-gray-400">{pct}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}