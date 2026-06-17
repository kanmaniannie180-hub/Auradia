import { motion } from "framer-motion";

const EMOTION_COLORS_HEX = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

// Draws an animated SVG curved line between two emotions
export default function ConnectorLine({ fromEmotion, toEmotion, index }) {
  const c1 = EMOTION_COLORS_HEX[fromEmotion] || "#a78bfa";
  const c2 = EMOTION_COLORS_HEX[toEmotion] || "#ec4899";
  const id = `grad-${index}`;

  return (
    <svg width="32" height="20" viewBox="0 0 32 20" className="flex-shrink-0 self-center" style={{ marginTop: -4 }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c2} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 10 Q16 2 32 10"
        stroke={`url(#${id})`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
      />
    </svg>
  );
}