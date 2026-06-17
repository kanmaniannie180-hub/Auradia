import { motion } from "framer-motion";
import { EMOTION_CONFIG, INTENSITY_LABELS } from "@/lib/emotionEngine";

export default function EmotionAnalysisCard({ emotion, intensity, intensityScore, confidence, transcript }) {
  const cfg = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;
  const intensityLabel = INTENSITY_LABELS[intensity] || "Moderate";
  const dots = [1, 2, 3, 4, 5];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl bg-gradient-to-br ${cfg.bg} border ${cfg.border} p-4`}
    >
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Emotion Detected</p>

      <div className="flex items-center gap-3 mb-3">
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
          style={{ background: cfg.color + "22", border: `1.5px solid ${cfg.color}55` }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {cfg.emoji}
        </motion.div>
        <div className="flex-1">
          <p className={`text-lg font-bold ${cfg.text}`}>{cfg.label}</p>
          <p className="text-xs text-gray-500">{intensityLabel} intensity</p>
          {confidence > 0 && (
            <p className="text-[10px] text-gray-400">{Math.round(confidence * 100)}% signal confidence</p>
          )}
        </div>
      </div>

      {/* Intensity dots */}
      <div className="flex gap-1.5 mb-3">
        {dots.map(d => (
          <div key={d} className="w-6 h-2 rounded-full transition-all"
            style={{ background: d <= intensityScore ? cfg.color : cfg.color + "22" }} />
        ))}
        <span className="text-[10px] text-gray-400 ml-1 self-center">{intensityScore}/5</span>
      </div>

      {/* Transcript snippet */}
      {transcript && transcript.length > 3 && (
        <div className="bg-white/50 rounded-2xl px-3 py-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">What you wrote</p>
          <p className="text-xs text-gray-600 leading-relaxed italic">
            "{transcript.length > 120 ? transcript.slice(0, 120) + "…" : transcript}"
          </p>
        </div>
      )}
    </motion.div>
  );
}