import { motion } from "framer-motion";

const MOOD_GRADIENTS = {
  happy: "from-amber-50 via-yellow-50 to-orange-50",
  calm: "from-sky-50 via-cyan-50 to-blue-50",
  stressed: "from-rose-50 via-pink-50 to-red-50",
  sad: "from-indigo-50 via-purple-50 to-violet-50",
  excited: "from-fuchsia-50 via-pink-50 to-rose-50",
  grateful: "from-emerald-50 via-teal-50 to-green-50",
  default: "from-violet-50 via-purple-50 to-pink-50",
};

const BLOB_CONFIGS = [
  { color: "from-purple-300/30 to-pink-300/20", size: "w-80 h-80", pos: "-top-24 -left-24", delay: 0 },
  { color: "from-blue-200/25 to-cyan-200/15", size: "w-96 h-96", pos: "-bottom-32 -right-24", delay: 6 },
  { color: "from-pink-200/25 to-rose-100/15", size: "w-72 h-72", pos: "top-1/3 -right-20", delay: 12 },
];

export default function AnimatedBackground({ mood = "default", children }) {
  const gradient = MOOD_GRADIENTS[mood] || MOOD_GRADIENTS.default;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} relative overflow-hidden`}>
      {BLOB_CONFIGS.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute ${blob.pos} ${blob.size} rounded-full bg-gradient-to-br ${blob.color} blur-3xl pointer-events-none`}
          animate={{ x: [0, 25, -15, 0], y: [0, -15, 12, 0], scale: [1, 1.04, 0.96, 1] }}
          transition={{ duration: 22, repeat: Infinity, delay: blob.delay, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/50"
            style={{ left: `${18 + i * 16}%`, top: `${12 + i * 14}%` }}
            animate={{ y: [0, -28, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.9 }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}