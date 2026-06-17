import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Square, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";

const EMOTION_COLORS = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8", sad: "#818cf8",
  stressed: "#f87171", angry: "#fb923c", anxious: "#c084fc", tired: "#7dd3fc",
  excited: "#f472b6", grateful: "#34d399",
};
const EMOTION_EMOJIS = {
  happy: "😊", calm: "😌", neutral: "😐", sad: "😢", stressed: "😰",
  angry: "😤", anxious: "😟", tired: "😴", excited: "🤩", grateful: "🙏",
};

function getGrowthInsight(daysAgo, hasReflection, emotion) {
  const positiveEmotions = ["happy", "excited", "grateful", "calm"];
  const isPositive = positiveEmotions.includes(emotion);
  if (hasReflection) {
    return isPositive
      ? "You've carried this lightness forward. It shows. ✨"
      : "You've grown since this moment — even if it doesn't always feel that way. 🌱";
  }
  if (daysAgo > 30) return "A lot can shift in a month. You're not the same person who wrote this.";
  return "You're still working through this — and that's okay. Growth takes time. 💜";
}

// Stagger wrapper for story chapters
const Chapter = ({ delay, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function CapsuleDetailModal({ capsule, onClose, onUpdate }) {
  const [reflection, setReflection] = useState(capsule.reflection || "");
  const [imageIndex, setImageIndex] = useState(0);
  const [revealPhase, setRevealPhase] = useState(capsule.opened_at ? "story" : "opening"); // "opening" | "unsealing" | "story"
  const [glowBurst, setGlowBurst] = useState(!capsule.opened_at);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReseal, setShowReseal] = useState(false);
  const [resealDate, setResealDate] = useState("");
  const audioRef = useRef(null);
  const queryClient = useQueryClient();

  const primaryEmotion = capsule.mood || capsule.emotion_tags?.[0];
  const color = EMOTION_COLORS[primaryEmotion] || "#a78bfa";
  const emoji = EMOTION_EMOJIS[primaryEmotion] || "✨";
  const daysAgo = Math.floor((new Date() - new Date(capsule.created_date)) / (1000 * 60 * 60 * 24));
  const images = capsule.images || [];
  const growthInsight = getGrowthInsight(daysAgo, !!capsule.reflection, primaryEmotion);

  // Auto-progress reveal phases
  useEffect(() => {
    if (revealPhase === "opening") {
      const t1 = setTimeout(() => setRevealPhase("unsealing"), 1200);
      return () => clearTimeout(t1);
    }
    if (revealPhase === "unsealing") {
      const t2 = setTimeout(() => {
        setRevealPhase("story");
        setGlowBurst(false);
      }, 2200);
      return () => clearTimeout(t2);
    }
  }, [revealPhase]);

  const reflectMutation = useMutation({
    mutationFn: ({ id, text }) => base44.entities.TimeCapsule.update(id, { reflection: text }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["capsules"] }); onUpdate?.(); },
  });
  const resealMutation = useMutation({
    mutationFn: ({ id, date }) => base44.entities.TimeCapsule.update(id, {
      status: "locked", unlock_date: date, opened_at: undefined, reflection: undefined,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["capsules"] }); onClose(); },
  });

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={revealPhase === "story" ? onClose : undefined}
    >
      {/* Glow burst */}
      <AnimatePresence>
        {glowBurst && (
          <motion.div
            initial={{ opacity: 0.6, scale: 0.2 }}
            animate={{ opacity: 0, scale: 3.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute pointer-events-none z-30 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}99 0%, transparent 70%)`,
              left: "50%", top: "50%", transform: "translate(-50%,-50%)",
              width: "100vw", height: "100vw",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="bg-white/97 backdrop-blur-2xl rounded-3xl w-full max-w-sm border border-white/70 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto relative"
        style={{ boxShadow: `0 24px 64px rgba(0,0,0,0.13), 0 0 0 1px ${color}22` }}
      >
        {/* ── REVEAL SCREEN ── */}
        <AnimatePresence>
          {(revealPhase === "opening" || revealPhase === "unsealing") && (
            <motion.div
              initial={{ opacity: 1 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-8 text-center"
              style={{ background: `linear-gradient(145deg, ${color}f0, #6366f1e0)` }}
            >
              <AnimatePresence mode="wait">
                {revealPhase === "opening" && (
                  <motion.div key="opening"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-6xl"
                    >⏳</motion.div>
                    <p className="text-white text-lg font-semibold">Opening your memory…</p>
                    <div className="flex gap-1.5 mt-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.9, delay: i * 0.22, repeat: Infinity }} />
                      ))}
                    </div>
                  </motion.div>
                )}
                {revealPhase === "unsealing" && (
                  <motion.div key="unsealing"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center gap-3"
                  >
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 1], rotate: [0, 20, -10, 0] }}
                      transition={{ duration: 1.0 }}
                      className="text-7xl"
                    >🔓</motion.div>
                    <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }} className="text-white text-xl font-bold">
                      Memory Unsealed
                    </motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }} className="text-white/80 text-sm">
                      ✨ A memory from your past
                    </motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }} className="text-white/60 text-xs">
                      {moment(capsule.created_date).format("MMMM D, YYYY")}
                    </motion.p>
                    {capsule.title && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }} className="text-white/90 text-base font-semibold mt-1">
                        "{capsule.title}"
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── COLOUR BAR ── */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${color}dd, ${color}44, transparent)` }} />

        {/* ── STORY CONTENT ── */}
        <div className="p-5 space-y-6">

          {/* Close + mini-header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">✨ A memory from your past</p>
              <p className="text-[10px] text-gray-300 mt-0.5">
                You wrote this {daysAgo === 0 ? "today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`}
              </p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100/80 flex items-center justify-center hover:bg-gray-200/70 transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Emotion identity */}
          <Chapter delay={0.05}>
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${color}18`, border: `1.5px solid ${color}44` }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {emoji}
              </motion.div>
              <div>
                {capsule.title && <p className="text-sm font-bold text-gray-800 leading-tight">{capsule.title}</p>}
                <p className="text-xs text-gray-400 capitalize">
                  Feeling <span style={{ color }} className="font-semibold">{primaryEmotion || "something deep"}</span>
                </p>
              </div>
            </div>
          </Chapter>

          <div className="h-px bg-gray-100" />

          {/* ── CHAPTER 1: THEN ── */}
          <Chapter delay={0.15}>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full" style={{ background: color + "99" }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: color + "cc" }}>
                  Then you felt…
                </p>
                <span className="text-[9px] text-gray-300 ml-auto">{moment(capsule.created_date).format("MMM D, YYYY")}</span>
              </div>
              <div
                className="rounded-2xl px-5 py-5 border border-gray-100/80"
                style={{
                  background: "linear-gradient(160deg, #fafafa 0%, #ffffff 100%)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <p className="text-[15px] text-gray-800 leading-[1.8] font-medium tracking-[-0.01em]">
                  {capsule.message}
                </p>
              </div>
            </div>
          </Chapter>

          {/* Images */}
          {images.length > 0 && (
            <Chapter delay={0.22}>
              <div className="relative">
                <img src={images[imageIndex]} alt="" className="w-full h-40 object-cover rounded-2xl border border-gray-100 shadow-sm" />
                {images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                    <button className="pointer-events-auto w-7 h-7 rounded-full bg-white/80 shadow flex items-center justify-center"
                      onClick={() => setImageIndex(i => Math.max(0, i - 1))}>
                      <ChevronLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="pointer-events-auto w-7 h-7 rounded-full bg-white/80 shadow flex items-center justify-center"
                      onClick={() => setImageIndex(i => Math.min(images.length - 1, i + 1))}>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            </Chapter>
          )}

          {/* Voice */}
          {capsule.voice_url && (
            <Chapter delay={0.26}>
              <div className="flex items-center gap-3 bg-gray-50/80 rounded-2xl px-3 py-3 border border-gray-100">
                <motion.button whileTap={{ scale: 0.9 }} onClick={togglePlay}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: color + "cc" }}>
                  {isPlaying
                    ? <Square className="w-3.5 h-3.5 text-white" fill="white" />
                    : <Play   className="w-3.5 h-3.5 text-white" fill="white" />}
                </motion.button>
                <div className="flex gap-0.5 items-center flex-1">
                  {[...Array(18)].map((_, i) => (
                    <motion.div key={i} className="rounded-full flex-shrink-0"
                      style={{ width: 2, background: color + "66" }}
                      animate={isPlaying ? { height: [3, 3 + Math.abs(Math.sin(i * 0.7)) * 10, 3] } : { height: 3 }}
                      transition={isPlaying ? { duration: 0.7, repeat: Infinity, delay: i * 0.04 } : {}} />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">🎙️ Voice memory</span>
                <audio ref={audioRef} src={capsule.voice_url} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>
            </Chapter>
          )}

          <div className="h-px bg-gray-100" />

          {/* ── CHAPTER 2: NOW ── */}
          <Chapter delay={0.32}>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-emerald-400/70" />
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600/80">
                  Now you reflect…
                </p>
              </div>

              {capsule.reflection ? (
                <div
                  className="rounded-2xl px-5 py-4 border"
                  style={{
                    background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 100%)",
                    borderColor: "#86efac66",
                    boxShadow: "0 0 0 1px #bbf7d033, 0 6px 20px #6ee7b712",
                  }}
                >
                  <p className="text-sm text-emerald-900/80 leading-[1.75] italic">"{capsule.reflection}"</p>
                </div>
              ) : (
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg, #f0fdf4 0%, #f7fffe 100%)",
                    borderColor: "#86efac44",
                    boxShadow: "0 0 0 1px #bbf7d022",
                  }}
                >
                  <div className="p-4 pb-2">
                    <Textarea
                      value={reflection}
                      onChange={e => setReflection(e.target.value)}
                      placeholder="How do you feel now compared to then? What has shifted?"
                      className="bg-transparent border-0 focus:ring-0 focus-visible:ring-0 shadow-none resize-none h-20 text-sm placeholder:text-gray-400/70 p-0 text-gray-700 leading-relaxed"
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => reflectMutation.mutate({ id: capsule.id, text: reflection })}
                      disabled={!reflection.trim() || reflectMutation.isPending}
                      className="w-full py-2.5 rounded-xl text-white text-xs font-bold disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg, #34d399, #059669)" }}
                    >
                      {reflectMutation.isPending ? "Saving…" : "Save Reflection ✨"}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </Chapter>

          <div className="h-px bg-gray-100" />

          {/* ── CHAPTER 3: GROWTH INSIGHT ── */}
          <Chapter delay={0.42}>
            <div
              className="rounded-2xl px-4 py-3.5 border flex items-start gap-3"
              style={{
                background: `linear-gradient(160deg, ${color}08, ${color}04)`,
                borderColor: color + "22",
              }}
            >
              <span className="text-base flex-shrink-0 mt-0.5">🌿</span>
              <p className="text-xs text-gray-500 leading-relaxed italic">{growthInsight}</p>
            </div>
          </Chapter>

          {/* Tags */}
          {capsule.emotion_tags?.length > 0 && (
            <Chapter delay={0.48}>
              <div className="flex gap-1.5 flex-wrap">
                {capsule.emotion_tags.map(t => (
                  <span key={t}
                    className="text-[10px] px-2.5 py-1 rounded-full capitalize font-medium"
                    style={{ background: color + "10", color: color + "bb", border: `1px solid ${color}1e` }}>
                    {t.replace("_", " ")}
                  </span>
                ))}
              </div>
            </Chapter>
          )}

          {/* Dates */}
          <Chapter delay={0.5}>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50/60 rounded-xl px-3 py-2.5 text-center border border-gray-100">
                <p className="text-[9px] text-gray-300 font-semibold uppercase tracking-wider">Written</p>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{moment(capsule.created_date).format("MMM D, YYYY")}</p>
              </div>
              {capsule.opened_at && (
                <div className="flex-1 rounded-xl px-3 py-2.5 text-center border"
                  style={{ background: color + "08", borderColor: color + "22" }}>
                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: color + "88" }}>Revisited</p>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{moment(capsule.opened_at).format("MMM D, YYYY")}</p>
                </div>
              )}
            </div>
          </Chapter>

          {/* Re-seal */}
          <div className="border-t border-gray-100 pt-3">
            {!showReseal ? (
              <button onClick={() => setShowReseal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-dashed border-gray-200/80 text-xs font-medium text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-all">
                <Lock className="w-3 h-3" /> Re-seal this memory
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Re-seal until</p>
                <input type="date" value={resealDate} onChange={e => setResealDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 text-gray-700" />
                <div className="flex gap-2">
                  <button onClick={() => setShowReseal(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold">Cancel</button>
                  <button
                    onClick={() => resealMutation.mutate({ id: capsule.id, date: resealDate })}
                    disabled={!resealDate || resealMutation.isPending}
                    className="flex-1 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                    🔒 Re-seal
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}