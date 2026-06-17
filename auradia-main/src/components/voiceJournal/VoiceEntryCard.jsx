import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, ChevronDown, ChevronUp } from "lucide-react";
import { EMOTION_CONFIG, INTENSITY_LABELS } from "@/lib/emotionEngine";
import moment from "moment";

function formatTime(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function VoiceEntryCard({ entry, index }) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const cfg = EMOTION_CONFIG[entry.detected_emotion] || EMOTION_CONFIG.neutral;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className={`rounded-3xl border overflow-hidden bg-gradient-to-br ${cfg.bg} ${cfg.border} shadow-sm`}>
        {/* Accent top bar */}
        <div className="h-0.5 w-full" style={{ background: cfg.color }} />

        <div className="p-4">
          {/* Top row */}
          <div className="flex items-center gap-3">
            {/* Emotion icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: cfg.color + "22", border: `1px solid ${cfg.color}44` }}>
              {cfg.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
                {entry.intensity && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/60 text-gray-500 font-semibold">
                    {INTENSITY_LABELS[entry.intensity]}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400">{moment(entry.created_date).format("MMM D, h:mm A")}</p>
            </div>

            {/* Play button */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={togglePlay}
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: cfg.color }}>
              {playing
                ? <Square className="w-3.5 h-3.5 text-white" fill="white" />
                : <Play className="w-3.5 h-3.5 text-white" fill="white" />
              }
            </motion.button>
            <audio ref={audioRef} src={entry.audio_url} onEnded={() => setPlaying(false)} className="hidden" />

            {/* Expand */}
            <button onClick={() => setExpanded(p => !p)} className="w-7 h-7 rounded-full bg-white/50 flex items-center justify-center flex-shrink-0">
              {expanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </button>
          </div>

          {/* Waveform bars (playing indicator) */}
          <AnimatePresence>
            {playing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-0.5 mt-2 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div key={i} className="rounded-full" style={{ width: 2, background: cfg.color + "99" }}
                    animate={{ height: [2, 2 + Math.abs(Math.sin(i * 0.7)) * 14, 2] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.04 }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transcript preview */}
          {!expanded && entry.transcript && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-1 italic">"{entry.transcript.slice(0, 70)}…"</p>
          )}

          {/* Expanded detail */}
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3 space-y-2">
                {entry.transcript && (
                  <div className="bg-white/50 rounded-2xl px-3 py-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Transcript</p>
                    <p className="text-xs text-gray-700 leading-relaxed italic">"{entry.transcript}"</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/50 rounded-xl px-3 py-2 text-center">
                    <p className="text-[9px] text-gray-400 uppercase font-semibold">Duration</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{formatTime(entry.duration_seconds || 0)}</p>
                  </div>
                  {entry.intensity_score && (
                    <div className="flex-1 bg-white/50 rounded-xl px-3 py-2 text-center">
                      <p className="text-[9px] text-gray-400 uppercase font-semibold">Intensity</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: cfg.color }}>{entry.intensity_score}/5</p>
                    </div>
                  )}
                </div>
                {entry.tags?.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {entry.tags.map(t => (
                      <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-white/60 text-gray-500 capitalize">{t}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}