import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function StreakCounter({ streakDays = 0 }) {
  const navigate = useNavigate();
  const progress = Math.min(streakDays / 30, 1);
  const circumference = 2 * Math.PI * 26;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.button
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.07)", transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(createPageUrl("GratitudeWall"))}
      className="rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3 text-left"
    >
      <div className="flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          Streak
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-base"
        >
          {streakDays > 0 ? "🔥" : "💫"}
        </motion.span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="4" />
            <motion.circle
              cx="30" cy="30" r="26" fill="none"
              stroke="url(#streak-g)" strokeWidth="4" strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              style={{ strokeDasharray: circumference }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.5 }}
            />
            <defs>
              <linearGradient id="streak-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
              className="text-lg font-bold text-gray-700"
            >
              {streakDays}
            </motion.span>
          </div>
        </div>
        <div>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-sm font-semibold text-gray-700"
          >
            Day streak
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}
            className="text-xs text-gray-400"
          >
            {streakDays >= 30 ? "30-day goal! 🎉" : `${30 - streakDays} days to goal`}
          </motion.p>
        </div>
      </div>
    </motion.button>
  );
}