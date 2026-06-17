import { motion } from "framer-motion";
import moment from "moment";

const EMOTION_COLORS = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

const TAG_COLORS = {
  growth: "bg-emerald-100 text-emerald-700",
  gratitude: "bg-amber-100 text-amber-700",
  stress: "bg-rose-100 text-rose-700",
  milestone: "bg-violet-100 text-violet-700",
  hope: "bg-sky-100 text-sky-700",
  healing: "bg-teal-100 text-teal-700",
  letting_go: "bg-orange-100 text-orange-700",
  reflection: "bg-indigo-100 text-indigo-700",
};

export default function CapsuleCard({ capsule, index, onOpen, onPreview }) {
  const now        = new Date();
  const unlockDate = new Date(capsule.unlock_date);
  const isOpened   = capsule.status === "opened";
  const canUnlock  = unlockDate <= now && !isOpened;
  const isLocked   = !isOpened && !canUnlock;

  const daysLeft = Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24));
  const daysAgo  = moment(capsule.created_date).fromNow();
  const moodColor = EMOTION_COLORS[capsule.emotion_tags?.[0]] || "#a78bfa";

  // Float offset per card so they don't all bob in sync
  const floatDelay = (index % 4) * 1.5;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      whileTap={{ scale: 0.96 }}
      style={{ filter: canUnlock ? "drop-shadow(0 8px 24px rgba(52,211,153,0.22))" : "none", transition: "filter 0.4s ease" }}
      onClick={() => {
        if (isOpened || canUnlock) onOpen?.(capsule);
        else onPreview?.(capsule);
      }}
      className="cursor-pointer">
      {/* Floating wrapper */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6 + floatDelay * 0.5, repeat: Infinity, delay: floatDelay, ease: "easeInOut" }}
      >
        {/* Glow pulse ring behind card */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{
            boxShadow: canUnlock
              ? ["0 0 0px rgba(52,211,153,0)", "0 0 22px rgba(52,211,153,0.45)", "0 0 0px rgba(52,211,153,0)"]
              : isOpened
              ? ["0 0 0px rgba(251,191,36,0)", "0 0 16px rgba(251,191,36,0.3)", "0 0 0px rgba(251,191,36,0)"]
              : ["0 0 0px rgba(139,92,246,0)", "0 0 12px rgba(139,92,246,0.18)", "0 0 0px rgba(139,92,246,0)"],
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: floatDelay }}
        />

        <div className={`rounded-3xl overflow-hidden border shadow-sm transition-all relative ${
          isOpened
            ? "bg-gradient-to-br from-amber-50/90 to-yellow-50/70 border-amber-200/60"
            : canUnlock
            ? "bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border-emerald-300/70"
            : "bg-white/50 backdrop-blur-xl border-white/60"
        }`}
          style={{
            boxShadow: canUnlock
              ? "0 6px 24px rgba(52,211,153,0.18), 0 2px 8px rgba(0,0,0,0.05)"
              : isOpened
              ? "0 6px 20px rgba(251,191,36,0.14)"
              : "0 4px 16px rgba(99,102,241,0.08)",
          }}
        >
          {/* Top accent bar */}
          <div className="h-0.5 w-full" style={{
            background: canUnlock
              ? "linear-gradient(to right, #34d399, #14b8a6)"
              : isOpened
              ? `linear-gradient(to right, ${moodColor}cc, ${moodColor}44)`
              : "linear-gradient(to right, #818cf8aa, #a855f744)",
          }} />

          {/* Shimmer for locked */}
          {isLocked && (
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
              />
            </div>
          )}

          <div className="p-4">
            {/* Icon + tag row */}
            <div className="flex items-start justify-between mb-3">
              <motion.div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{
                  background: isOpened ? "#fef3c7" : canUnlock ? "#d1fae5" : "rgba(255,255,255,0.55)",
                }}
                animate={canUnlock ? { rotate: [-4, 4, -4] } : {}}
                transition={canUnlock ? { duration: 2.5, repeat: Infinity } : {}}
              >
                {isOpened ? "✨" : canUnlock ? "🔓" : "🔒"}
              </motion.div>

              {capsule.emotion_tags?.length > 0 && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold capitalize ${TAG_COLORS[capsule.emotion_tags[0]] || "bg-purple-100 text-purple-700"}`}>
                  {capsule.emotion_tags[0].replace("_", " ")}
                </span>
              )}
            </div>

            {/* "You wrote this X ago" emotional touch */}
            <p className="text-[9px] font-medium mb-2"
              style={{ color: isOpened ? "#d97706" : canUnlock ? "#059669" : "#818cf8" }}>
              You wrote this {daysAgo}
            </p>

            {/* Content */}
            {isOpened ? (
              <>
                {capsule.title && <p className="text-xs font-bold text-gray-800 mb-0.5 leading-tight truncate">{capsule.title}</p>}
                <p className="text-xs text-gray-600 mb-1 line-clamp-2 leading-snug">
                  {capsule.message?.slice(0, 55)}{capsule.message?.length > 55 ? "…" : ""}
                </p>
                <p className="text-[10px] text-gray-400">Opened {moment(capsule.opened_at).fromNow()}</p>
              </>
            ) : canUnlock ? (
              <>
                {capsule.title && <p className="text-xs font-bold text-emerald-800 mb-0.5 leading-tight truncate">{capsule.title}</p>}
                <p className="text-xs font-semibold text-emerald-700 mb-1">Ready to open!</p>
                <p className="text-[10px] text-gray-500">Sealed {daysAgo}</p>
              </>
            ) : (
              <>
                {capsule.title ? <p className="text-xs font-bold text-gray-700 mb-0.5 leading-tight truncate">{capsule.title}</p> : null}
                <p className="text-xs font-semibold text-gray-400 blur-[3px] line-clamp-2 select-none mb-1">
                  {capsule.message?.slice(0, 40) || "A memory sealed in time..."}
                </p>
                <p className="text-[10px] text-gray-400">Opens in {daysLeft}d</p>
              </>
            )}

            <p className="text-[9px] text-gray-300 mt-2">{moment(capsule.created_date).format("MMM D, YYYY")}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}