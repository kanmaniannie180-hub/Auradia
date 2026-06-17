import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, X, Check } from "lucide-react";
import { EMOTION_EMOJIS } from "@/components/shared/MoodOrb";
import FloatingBubble from "@/components/moodBubbles/FloatingBubble";
import CentralBubble from "@/components/moodBubbles/CentralBubble";
import MoodInsights from "@/components/moodBubbles/MoodInsights";
import moment from "moment";

const EMOTIONS = [
  { id: "happy", color: "#fbbf24" },
  { id: "calm", color: "#38bdf8" },
  { id: "sad", color: "#818cf8" },
  { id: "stressed", color: "#f87171" },
  { id: "excited", color: "#f472b6" },
  { id: "grateful", color: "#34d399" },
  { id: "anxious", color: "#c084fc" },
  { id: "tired", color: "#7dd3fc" },
  { id: "neutral", color: "#94a3b8" },
  { id: "angry", color: "#fb923c" },
];

const AMBIENT_GRADIENTS = {
  happy:    "from-amber-50 via-yellow-50 to-orange-50",
  calm:     "from-sky-50 via-cyan-50 to-blue-50",
  sad:      "from-indigo-50 via-violet-50 to-purple-50",
  stressed: "from-rose-50 via-red-50 to-orange-50",
  excited:  "from-fuchsia-50 via-pink-50 to-rose-50",
  grateful: "from-emerald-50 via-teal-50 to-green-50",
  anxious:  "from-violet-50 via-purple-50 to-fuchsia-50",
  tired:    "from-blue-50 via-slate-50 to-sky-50",
  neutral:  "from-gray-50 via-slate-50 to-zinc-50",
  angry:    "from-orange-50 via-amber-50 to-red-50",
  default:  "from-violet-50 via-purple-50 to-pink-50",
};

function getDayPeriod() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

export default function MoodBubbles() {
  const [selected, setSelected] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState(null);
  const [view, setView] = useState("input"); // "input" | "visualization"
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: moods = [] } = useQuery({
    queryKey: ["moods"],
    queryFn: () => base44.entities.Mood.list("-created_date", 40),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.Mood.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setView("visualization");
        setSelectedBubble(null);
      }, 1500);
    },
  });

  const bgGradient = AMBIENT_GRADIENTS[selected || "default"];

  // Show max 20 bubbles in visualization
  const bubbleMoods = moods.slice(0, 20);
  const todayMoods = moods.filter(m => moment(m.created_date).isSame(moment(), "day"));

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden`}
      animate={{ background: undefined }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Animated ambient blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: selected ? EMOTIONS.find(e => e.id === selected)?.color + "22" : "#a78bfa22" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: selected ? EMOTIONS.find(e => e.id === selected)?.color + "18" : "#ec489922" }}
        animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      <div className="max-w-lg mx-auto relative z-10 flex flex-col min-h-screen">

        {/* ── HEADER ── */}
        <div className="px-4 pt-6 pb-2 flex items-center justify-between">
          <button onClick={() => navigate(createPageUrl("Home"))}
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <button onClick={() => setView("input")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${view === "input" ? "bg-white/70 text-purple-600 shadow-sm border border-white/80" : "text-gray-400"}`}>
              Log Mood
            </button>
            <button onClick={() => setView("visualization")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${view === "visualization" ? "bg-white/70 text-purple-600 shadow-sm border border-white/80" : "text-gray-400"}`}>
              My Bubbles
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════
              VIEW: INPUT — 3-layer layout
          ══════════════════════════════════════════ */}
          {view === "input" && (
            <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-1 px-4 pb-32">

              {/* ── LAYER 1: INPUT ── */}
              <div className="pt-4 pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">How are you feeling right now?</h1>
                <p className="text-sm text-gray-400 mt-1">Tap what feels closest to you</p>

                {/* Emotion chips */}
                <div className="grid grid-cols-5 gap-3 mt-5">
                  {EMOTIONS.map((em, i) => {
                    const isActive = selected === em.id;
                    return (
                      <motion.button
                        key={em.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.035, type: "spring", stiffness: 300 }}
                        whileHover={{ scale: 1.1, transition: { duration: 0.18 } }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => { setSelected(em.id === selected ? null : em.id); setNote(""); }}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <motion.div
                          className="rounded-2xl flex items-center justify-center relative"
                          style={{
                            width: 58, height: 58,
                            background: isActive ? `radial-gradient(circle at 35% 35%, ${em.color}ff, ${em.color}99)` : `${em.color}20`,
                            boxShadow: isActive
                              ? `0 0 28px ${em.color}77, 0 4px 16px ${em.color}44, 0 0 0 2.5px ${em.color}66`
                              : `0 0 0px transparent`,
                            border: isActive ? `2px solid ${em.color}66` : "2px solid transparent",
                            transition: "box-shadow 0.3s ease, background 0.3s ease",
                          }}
                          animate={isActive
                            ? { scale: [1, 1.12, 1.06, 1.1, 1.06], boxShadow: [
                                `0 0 18px ${em.color}55`,
                                `0 0 36px ${em.color}88`,
                                `0 0 24px ${em.color}66`,
                              ]}
                            : { scale: 1 }
                          }
                          transition={isActive ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : {}}
                        >
                          {isActive && (
                            <div className="absolute top-2 left-2.5 w-2 h-1.5 rounded-full bg-white/50" />
                          )}
                          <span className="text-2xl">{EMOTION_EMOJIS[em.id]}</span>
                        </motion.div>
                        <span className={`text-[10px] font-semibold capitalize transition-colors ${isActive ? "text-gray-800" : "text-gray-400"}`}>
                          {em.id}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Emotional feedback after selection */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    key={selected + "-feedback"}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-3 px-4 py-2.5 rounded-2xl border text-center"
                    style={{
                      background: `${EMOTIONS.find(e => e.id === selected)?.color}12`,
                      borderColor: `${EMOTIONS.find(e => e.id === selected)?.color}30`,
                    }}
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      You're feeling <span className="font-bold capitalize" style={{ color: EMOTIONS.find(e => e.id === selected)?.color }}>{selected}</span> {EMOTION_EMOJIS[selected]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── LAYER 2: VISUALIZATION (Central Bubble preview) ── */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Intensity slider + live bubble preview */}
                    <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-3xl p-5 mb-4">
                      <p className="text-xs font-bold text-gray-600 mb-1">How strong is this feeling?</p>
                    <p className="text-[10px] text-gray-400 mb-4">Drag to adjust intensity</p>

                      {/* Custom range slider */}
                      <div className="mb-4">
                        <input
                          type="range"
                          min={1} max={5} step={1}
                          value={intensity}
                          onChange={(e) => setIntensity(Number(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${EMOTIONS.find(e => e.id === selected)?.color || "#a78bfa"} 0%, ${EMOTIONS.find(e => e.id === selected)?.color || "#a78bfa"} ${(intensity - 1) * 25}%, rgba(255,255,255,0.4) ${(intensity - 1) * 25}%, rgba(255,255,255,0.4) 100%)`,
                            WebkitAppearance: "none",
                          }}
                        />
                        <div className="flex justify-between mt-2">
                          {["Barely", "Mildly", "Quite", "Very", "Deeply"].map((l, i) => (
                            <span key={l} className={`text-[10px] font-medium ${intensity === i + 1 ? "text-gray-800" : "text-gray-400"}`}>{l}</span>
                          ))}
                        </div>
                      </div>

                      {/* Live central bubble preview */}
                      <div className="flex justify-center items-center" style={{ height: 220, position: "relative" }}>
                        <CentralBubble emotion={selected} intensity={intensity} />
                      </div>
                    </div>

                    {/* Note */}
                    <div className="mb-4">
                      <Textarea
                        placeholder={`What's behind this ${selected} feeling? (optional)`}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="bg-white/40 backdrop-blur-xl border-white/50 rounded-2xl resize-none h-20 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-purple-300"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── SAVE BUTTON ── */}
              <AnimatePresence>
                {selected && !saved && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => saveMutation.mutate({ emotion: selected, intensity, note: note || undefined, day_period: getDayPeriod() })}
                      disabled={saveMutation.isPending}
                      className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${EMOTIONS.find(e => e.id === selected)?.color}dd, ${EMOTIONS.find(e => e.id === selected)?.color}aa)` }}
                    >
                      {saveMutation.isPending ? "Saving..." : `Save — ${EMOTION_EMOJIS[selected]} ${selected}`}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Saved confirmation */}
              <AnimatePresence>
                {saved && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center gap-3 py-6">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: 2 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
                      <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <p className="text-gray-700 font-bold">Mood saved! ✨</p>
                    <p className="text-sm text-gray-400 text-center">Thanks for sharing. Every small check-in matters.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── LAYER 3: INSIGHT (shown at bottom when no mood selected) ── */}
              {!selected && moods.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <MoodInsights moods={moods} />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              VIEW: VISUALIZATION — Floating bubbles
          ══════════════════════════════════════════ */}
          {view === "visualization" && (
            <motion.div key="viz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="flex flex-col flex-1 px-4 pb-32">

              <div className="pt-2 pb-3">
                <h2 className="text-lg font-bold text-gray-800">Your Emotional Universe</h2>
                <p className="text-xs text-gray-400">{moods.length} moods logged · tap any bubble to see details</p>
              </div>

              {/* Bubble Field */}
              {moods.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl">🫧</motion.div>
                  <p className="text-gray-600 font-medium">No bubbles yet</p>
                  <p className="text-sm text-gray-400">Log your first mood to see it appear here</p>
                  <button onClick={() => setView("input")}
                    className="mt-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-md">
                    Log Mood ✨
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="relative rounded-3xl overflow-hidden bg-white/25 backdrop-blur-sm border border-white/40 mb-4"
                    style={{ height: 320 }}>
                    {/* Blur depth layers */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none z-20" />

                    {bubbleMoods.map((mood, i) => (
                      <FloatingBubble
                        key={mood.id}
                        mood={mood}
                        index={i}
                        isRecent={i < 5}
                        isSelected={selectedBubble?.id === mood.id}
                        onClick={(m) => setSelectedBubble(prev => prev?.id === m.id ? null : m)}
                      />
                    ))}

                    {/* Bubble detail card */}
                    <AnimatePresence>
                      {selectedBubble && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute bottom-3 left-3 right-3 z-30 bg-white/80 backdrop-blur-2xl border border-white/80 rounded-2xl px-4 py-3 shadow-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{EMOTION_EMOJIS[selectedBubble.emotion]}</span>
                              <div>
                                <p className="text-sm font-bold text-gray-800 capitalize">{selectedBubble.emotion}</p>
                                <p className="text-xs text-gray-400">
                                  Intensity {selectedBubble.intensity}/5 · {moment(selectedBubble.created_date).format("MMM D, h:mm A")}
                                </p>
                              </div>
                            </div>
                            <button onClick={() => setSelectedBubble(null)}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <X className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                          </div>
                          {selectedBubble.note && (
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed bg-gray-50/70 rounded-xl px-3 py-2 italic">
                              "{selectedBubble.note}"
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Today count badge */}
                    {todayMoods.length > 0 && (
                      <div className="absolute top-3 right-3 z-30 bg-white/70 backdrop-blur-sm border border-white/70 rounded-full px-2.5 py-1 text-[10px] font-bold text-purple-600">
                        {todayMoods.length} today
                      </div>
                    )}
                  </div>

                  {/* ── LAYER 3: INSIGHTS ── */}
                  <MoodInsights moods={moods} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slider thumb global styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18), 0 0 0 3px rgba(168,85,247,0.3);
          cursor: pointer;
          transition: transform 0.15s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type=range]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </motion.div>
  );
}