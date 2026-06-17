import { motion } from "framer-motion";

const EMOTION_COLORS_HEX = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

const EMOTION_EMOJIS = {
  happy: "😊", calm: "😌", neutral: "😐", sad: "😢", stressed: "😰",
  angry: "😤", anxious: "😟", tired: "😴", excited: "🤩", grateful: "🙏",
};

const SOURCE_ICONS = {
  timeCapsule: "🔐",
  voiceJournal: "🎙️",
  mood: null,
};

export default function TimelineNode({ mood, index, isSelected, onClick }) {
  const color = EMOTION_COLORS_HEX[mood.emotion] || "#a78bfa";
  const size = 26 + mood.intensity * 6; // 32px – 56px
  const source = mood._source || "mood";
  const sourceIcon = SOURCE_ICONS[source];

  // Short reason label — truncate at 18 chars
  const reasonLabel = mood.note
    ? mood.note.length > 18 ? mood.note.slice(0, 16) + "…" : mood.note
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 280, damping: 20 }}
      className="flex flex-col items-center cursor-pointer select-none"
      style={{ maxWidth: size + 24 }}
      onClick={() => onClick(mood)}
    >
      {/* Outer pulse ring when selected */}
      <div className="relative flex items-center justify-center" style={{ width: size + 16, height: size + 16 }}>
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: color + "33" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}

        {/* Main node */}
        <motion.div
          className="rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle at 35% 30%, ${color}ff, ${color}99)`,
            boxShadow: isSelected
              ? `0 0 0 3px white, 0 0 18px ${color}88`
              : `0 2px 10px ${color}44`,
          }}
          animate={isSelected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={isSelected ? { duration: 1.5, repeat: Infinity } : {}}
          whileHover={{ scale: 1.15, boxShadow: `0 0 0 2px white, 0 0 14px ${color}66` }}
          whileTap={{ scale: 0.88 }}
        >
          {/* Shine */}
          <div className="absolute top-0.5 left-1 rounded-full bg-white/40"
            style={{ width: size * 0.3, height: size * 0.18 }} />
          <span style={{ fontSize: size * 0.42 }}>{EMOTION_EMOJIS[mood.emotion]}</span>
        </motion.div>

        {/* Source badge (top-right) */}
        {sourceIcon && (
          <div className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-white border border-gray-100 shadow flex items-center justify-center"
            style={{ width: 17, height: 17, fontSize: 9 }}>
            {sourceIcon}
          </div>
        )}

        {/* Note indicator (bottom-right) — only when no source badge */}
        {!sourceIcon && mood.note && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-gray-100 shadow flex items-center justify-center text-[8px]">
            📝
          </div>
        )}
      </div>

      {/* Reason label below node */}
      {reasonLabel && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.2 }}
          className="text-[8px] text-gray-500 text-center leading-tight mt-0.5 max-w-full px-0.5 truncate"
          style={{ maxWidth: size + 16 }}
        >
          {reasonLabel}
        </motion.p>
      )}
    </motion.div>
  );
}