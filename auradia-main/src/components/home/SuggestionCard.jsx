import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles } from "lucide-react";

function getSuggestion(lastMood, moods, streakDays, gratitudeCount) {
  const today = new Date().toDateString();
  const loggedToday = moods.some(m => new Date(m.created_date).toDateString() === today);
  if (!loggedToday) return { text: "Take a moment to check in with yourself", cta: "Log Mood", page: "MoodBubbles", emoji: "🫧", color: "from-violet-500 to-purple-600" };
  const negativeEmotions = ["sad", "stressed", "angry", "anxious", "tired"];
  const negCount = moods.slice(0, 3).filter(m => negativeEmotions.includes(m.emotion)).length;
  if (negCount >= 2) return { text: "A breathing pause might help right now", cta: "Open Calm Zone", page: "CalmZone", emoji: "🧘", color: "from-sky-500 to-blue-600" };
  if (streakDays === 0 && gratitudeCount > 0) return { text: "Keep your gratitude streak alive", cta: "Write Gratitude", page: "GratitudeWall", emoji: "🌱", color: "from-emerald-500 to-teal-600" };
  return { text: "Reflect on your journey today with your voice", cta: "Open Journal", page: "VoiceJournal", emoji: "🎙️", color: "from-rose-500 to-pink-600" };
}

export default function SuggestionCard({ lastMood, moods = [], streakDays = 0, gratitudeCount = 0 }) {
  const navigate = useNavigate();
  const s = getSuggestion(lastMood, moods, streakDays, gratitudeCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.3, ease: "easeOut" } }}
      className={`rounded-3xl bg-gradient-to-br ${s.color} p-px shadow-lg cursor-pointer`}
      style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}
    >
      <div className="rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm px-5 py-5">
        <div className="flex items-start gap-3">
          {/* Emoji with gentle float */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0 border border-white/30"
          >
            {s.emoji}
          </motion.div>
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 mb-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">For You</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
              className="text-sm text-white font-medium leading-snug mb-3"
            >
              {s.text}
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.48 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.35)", transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(createPageUrl(s.page))}
              className="bg-white/20 border border-white/40 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-colors"
            >
              {s.cta} →
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}