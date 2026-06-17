import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Card3D from "@/components/shared/Card3D";

const ACTIONS = [
  { label: "Mood",     emoji: "🫧", page: "MoodBubbles",  bg: "from-violet-100 to-purple-100", border: "border-violet-200/60",  glow: "rgba(139,92,246,0.25)" },
  { label: "Breathe",  emoji: "🧘", page: "CalmZone",     bg: "from-sky-100 to-cyan-100",      border: "border-sky-200/60",     glow: "rgba(56,189,248,0.25)" },
  { label: "Journal",  emoji: "🎙️", page: "VoiceJournal", bg: "from-rose-100 to-pink-100",     border: "border-rose-200/60",    glow: "rgba(244,114,182,0.25)" },
  { label: "Gratitude",emoji: "🌱", page: "GratitudeWall",bg: "from-emerald-100 to-teal-100",  border: "border-emerald-200/60", glow: "rgba(52,211,153,0.25)" },
  { label: "Coach",    emoji: "🤖", page: "AIMoodCoach",  bg: "from-amber-100 to-yellow-100",  border: "border-amber-200/60",   glow: "rgba(251,191,36,0.25)" },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
      >
        Quick Access
      </motion.p>
      <div className="flex justify-between gap-2">
        {ACTIONS.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.07, duration: 0.45, ease: "easeOut" }}
            className="flex-1"
          >
            <Card3D
              glowColor={action.glow}
              intensity={14}
              onClick={() => navigate(createPageUrl(action.page))}
              className="flex flex-col items-center gap-1.5 cursor-pointer rounded-2xl p-0.5"
            >
              <motion.div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.bg} border ${action.border} flex items-center justify-center shadow-sm`}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6 + i * 0.7, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              >
                <span className="text-xl">{action.emoji}</span>
              </motion.div>
              <span className="text-[10px] font-medium text-gray-500">{action.label}</span>
            </Card3D>
          </motion.div>
        ))}
      </div>
    </div>
  );
}