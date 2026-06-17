import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square } from "lucide-react";

function formatTime(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function RecordingOrb({ recording, elapsed, onStart, onStop, maxSeconds = 180 }) {
  const progress = Math.min(elapsed / maxSeconds, 1);
  const circumference = 2 * Math.PI * 46;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(168,85,247,0.12)" strokeWidth="4" />
          {recording && (
            <motion.circle cx="50" cy="50" r="46" fill="none"
              stroke="url(#rec-grad)" strokeWidth="4" strokeLinecap="round"
              style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
              transition={{ duration: 0.5 }}
            />
          )}
          <defs>
            <linearGradient id="rec-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulse rings when recording */}
        <AnimatePresence>
          {recording && [1, 2].map(i => (
            <motion.div key={i}
              className="absolute rounded-full border border-rose-300/40"
              style={{ width: 90 + i * 18, height: 90 + i * 18 }}
              initial={{ opacity: 0.6, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity }}
            />
          ))}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={recording ? onStop : onStart}
          className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
          style={{
            background: recording
              ? "linear-gradient(135deg, #f87171, #ec4899)"
              : "linear-gradient(135deg, #a855f7, #ec4899)",
            boxShadow: recording
              ? "0 0 32px rgba(248,113,113,0.45)"
              : "0 0 32px rgba(168,85,247,0.35)",
          }}
          whileTap={{ scale: 0.92 }}
          animate={recording ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={recording ? { duration: 1.4, repeat: Infinity } : {}}
        >
          {recording
            ? <Square className="w-7 h-7 text-white" fill="white" />
            : <Mic className="w-7 h-7 text-white" />
          }
        </motion.button>
      </div>

      {/* Timer */}
      <div className="text-center">
        <p className="text-xl font-mono font-bold text-gray-700">{formatTime(elapsed)}</p>
        {recording ? (
          <motion.p className="text-xs text-rose-500 font-semibold" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            ● Recording
          </motion.p>
        ) : elapsed > 0 ? (
          <p className="text-xs text-gray-400">Tap to re-record</p>
        ) : (
          <p className="text-xs text-gray-400">Tap to start</p>
        )}
      </div>

      {/* Waveform bars while recording */}
      <AnimatePresence>
        {recording && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1">
            {[...Array(16)].map((_, i) => (
              <motion.div key={i} className="rounded-full bg-gradient-to-t from-rose-400 to-pink-400"
                style={{ width: 3 }}
                animate={{ height: [4, 4 + Math.abs(Math.sin(i * 0.8)) * 20, 4] }}
                transition={{ duration: 0.6 + i * 0.04, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}