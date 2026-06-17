import { motion } from "framer-motion";

export default function RippleVisualization({ score, color = "#a855f7" }) {
  const total = score.positive + score.negative;
  const positiveRatio = score.positive / total;
  const rings = [1, 2, 3, 4];

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        {/* Expanding rings */}
        {rings.map((ring, i) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border"
            style={{
              width: 30 + ring * 26,
              height: 30 + ring * 26,
              borderColor: color + (["55", "40", "28", "16"][i]),
              borderWidth: i === 0 ? 2 : 1.5,
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.4, 0.7] }}
            transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
        ))}

        {/* Core circle */}
        <motion.div
          className="relative z-10 w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-lg"
          style={{ background: `radial-gradient(circle at 35% 35%, ${color}ff, ${color}99)` }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-lg leading-none">{score.positive}</span>
          <span className="text-[9px] opacity-70 font-normal">score</span>
        </motion.div>
      </div>

      {/* Score bar */}
      <div className="w-full max-w-[200px]">
        <div className="flex justify-between text-[10px] mb-1 font-semibold">
          <span className="text-emerald-600">+{score.positive} positive</span>
          <span className="text-rose-500">−{score.negative} negative</span>
        </div>
        <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            initial={{ width: "50%" }}
            animate={{ width: `${positiveRatio * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}