import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";

export default function GratitudePreview({ lastGratitude }) {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(251,191,36,0.14)", transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(createPageUrl("GratitudeWall"))}
      className="rounded-3xl bg-gradient-to-br from-amber-50/80 to-yellow-50/60 border border-amber-100/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3 text-left"
    >
      <div className="flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="text-xs font-semibold text-amber-500 uppercase tracking-wider"
        >
          Gratitude
        </motion.span>
        <motion.span
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-base"
        >
          {lastGratitude?.emoji || "🌸"}
        </motion.span>
      </div>

      {lastGratitude ? (
        <>
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.4 }}
            className="text-xs text-gray-600 leading-relaxed line-clamp-2"
          >
            {lastGratitude.text}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}
            className="text-[10px] text-gray-400"
          >
            {moment(lastGratitude.created_date).fromNow()}
          </motion.p>
        </>
      ) : (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}
          className="text-xs text-gray-400 leading-relaxed"
        >
          Write your first gratitude note today
        </motion.p>
      )}
    </motion.button>
  );
}