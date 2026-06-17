import { motion } from "framer-motion";
import MoodOrb from "../shared/MoodOrb";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";
import { ArrowRight } from "lucide-react";

export default function TodayMoodSnapshot({ lastMood }) {
  const navigate = useNavigate();

  if (!lastMood) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(168,85,247,0.18)", transition: { duration: 0.3 } }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(createPageUrl("MoodBubbles"))}
        className="w-full rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-px shadow-lg"
      >
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl px-5 py-4 flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl"
          >
            🫧
          </motion.div>
          <div className="flex-1 text-left">
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-semibold text-gray-800 text-sm"
            >
              How are you feeling?
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="text-xs text-gray-400 mt-0.5"
            >
              Tap to check in with yourself
            </motion.p>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-400" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: [0, 0, -4, 0], scale: 1 }}
      transition={{ opacity: { duration: 0.5, delay: 0.1 }, scale: { duration: 0.5, delay: 0.1 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
      whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(createPageUrl("MoodBubbles"))}
      className="w-full rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.05)] px-5 py-4 flex items-center gap-4 text-left"
    >
      <MoodOrb emotion={lastMood.emotion} intensity={lastMood.intensity} size="md" showLabel={false} />
      <div className="flex-1">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-semibold text-gray-800 capitalize text-sm"
        >
          {lastMood.emotion}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mt-0.5"
        >
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= lastMood.intensity ? "bg-purple-400" : "bg-gray-200"}`} />
            ))}
          </div>
          <span className="text-xs text-gray-400">{moment(lastMood.created_date).fromNow()}</span>
        </motion.div>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300" />
    </motion.button>
  );
}