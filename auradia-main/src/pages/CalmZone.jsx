import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play, Pause, RotateCcw, Music, Music2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// ─── Breathing exercises ───────────────────────────────────────────────────
const EXERCISES = [
  {
    id: "relax_4_4_6",
    label: "Relax",
    phases: [4, 4, 6, 0],
    desc: "Inhale 4 · Hold 4 · Exhale 6",
    emoji: "😮‍💨",
    gradient: ["#38bdf8", "#818cf8"],
    bg: "from-sky-900/80 via-indigo-900/70 to-violet-900/80",
  },
  {
    id: "deep_calm_4_7_8",
    label: "Deep Calm",
    phases: [4, 7, 8, 0],
    desc: "Inhale 4 · Hold 7 · Exhale 8",
    emoji: "🌊",
    gradient: ["#6366f1", "#a855f7"],
    bg: "from-indigo-900/80 via-violet-900/70 to-purple-900/80",
  },
  {
    id: "equal_4_4_4_4",
    label: "Box",
    phases: [4, 4, 4, 4],
    desc: "Inhale 4 · Hold 4 · Exhale 4 · Hold 4",
    emoji: "🔲",
    gradient: ["#2dd4bf", "#34d399"],
    bg: "from-teal-900/80 via-emerald-900/70 to-cyan-900/80",
  },
  {
    id: "slow_5_5_7",
    label: "Slow & Soft",
    phases: [5, 5, 7, 0],
    desc: "Inhale 5 · Hold 5 · Exhale 7",
    emoji: "🕊️",
    gradient: ["#f472b6", "#fb7185"],
    bg: "from-rose-900/80 via-pink-900/70 to-fuchsia-900/80",
  },
];

const DURATIONS = [
  { s: 60,  label: "1 min" },
  { s: 180, label: "3 min" },
  { s: 300, label: "5 min" },
  { s: 600, label: "10 min" },
];

const PHASE_NAMES = ["Inhale", "Hold", "Exhale", "Rest"];

// ─── Floating particle ─────────────────────────────────────────────────────
function Particle({ i, color }) {
  const size  = 4 + (i % 5) * 3;
  const left  = 5 + (i * 17) % 90;
  const delay = (i * 0.7) % 8;
  const dur   = 10 + (i % 6) * 3;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: `${left}%`,
        bottom: "-10px",
        background: color + "44",
      }}
      animate={{ y: [0, -(300 + (i % 4) * 120)], opacity: [0, 0.6, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

// ─── Orb glow ring ─────────────────────────────────────────────────────────
function GlowRing({ scale, color, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: 280, height: 280, border: `1px solid ${color}33` }}
      animate={{ scale: [1, scale], opacity: [0.5, 0] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

export default function CalmZone() {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();

  const [exercise,     setExercise]     = useState(EXERCISES[0]);
  const [duration,     setDuration]     = useState(180);
  const [state,        setState]        = useState("idle"); // idle | running | paused | done
  const [elapsed,      setElapsed]      = useState(0);
  const [phaseIdx,     setPhaseIdx]     = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [postMood,     setPostMood]     = useState(null);
  const [musicOn,      setMusicOn]      = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);

  const intervalRef = useRef(null);

  // Derived phase data
  const activePhaseDurations = exercise.phases.filter(p => p > 0);
  const cycleLen     = activePhaseDurations.length;
  const curCycleIdx  = phaseIdx % cycleLen;
  const phaseTime    = activePhaseDurations[curCycleIdx];
  // Map back to original phase index for label/color
  let origIdx = 0;
  let counted = -1;
  for (let i = 0; i < exercise.phases.length; i++) {
    if (exercise.phases[i] > 0) { counted++; if (counted === curCycleIdx) { origIdx = i; break; } }
  }
  const phaseName  = PHASE_NAMES[origIdx];
  const isInhale   = phaseName === "Inhale";
  const isHold     = phaseName === "Hold";
  const isExhale   = phaseName === "Exhale";

  // Orb scale: 0.6 → 1.4 on inhale, holds at 1.4, 1.4 → 0.6 on exhale
  const orbScale = state === "running"
    ? isInhale  ? 0.6 + (phaseElapsed / phaseTime) * 0.8
    : isHold    ? 1.4
    : isExhale  ? 1.4 - (phaseElapsed / phaseTime) * 0.8
    : 0.7
    : 1.0;

  const glowIntensity = isInhale ? 0.4 + (phaseElapsed / phaseTime) * 0.5
    : isHold ? 0.9
    : isExhale ? 0.9 - (phaseElapsed / phaseTime) * 0.5
    : 0.3;

  // Timer tick
  useEffect(() => {
    if (state !== "running") { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev + 1 >= duration) {
          clearInterval(intervalRef.current);
          setState("done");
          return duration;
        }
        return prev + 1;
      });
      setPhaseElapsed(prev => {
        if (prev + 1 >= phaseTime) { setPhaseIdx(pi => pi + 1); return 0; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [state, phaseTime, duration]);

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.CalmSession.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["calm-sessions"] }); },
  });

  const startSession = () => {
    setShowMusicPrompt(true);
  };

  const confirmStart = (withMusic) => {
    setMusicOn(withMusic);
    setShowMusicPrompt(false);
    setState("running");
  };

  const pauseSession = () => setState("paused");
  const resumeSession = () => setState("running");
  const stopSession   = () => { setState("idle"); setElapsed(0); setPhaseIdx(0); setPhaseElapsed(0); };
  const formatTime    = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const progress      = elapsed / duration;

  const [c1, c2] = exercise.gradient;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${exercise.bg} relative overflow-hidden`}>

      {/* ── AMBIENT BACKGROUND BLOBS ── */}
      <motion.div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c1}22 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c2}22 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* ── PARTICLES ── */}
      {state === "running" && (
        [...Array(14)].map((_, i) => <Particle key={i} i={i} color={c1} />)
      )}

      {/* ── STARS (always) ── */}
      {[...Array(20)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-white/30 pointer-events-none"
          style={{ left: `${(i * 13) % 95}%`, top: `${(i * 7) % 85}%` }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 3 + (i % 4), delay: i * 0.3, repeat: Infinity }}
        />
      ))}

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-lg mx-auto flex flex-col min-h-screen">

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-8 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
        >
          <button onClick={() => navigate(createPageUrl("Home"))}
            className="flex items-center gap-1.5 text-white/60 text-sm hover:text-white/90 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center">
            <p className="text-white/90 font-bold text-sm tracking-wide">Calm Zone</p>
            {state === "running" && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-white/50 text-[10px] font-mono tracking-widest">
                {formatTime(elapsed)} · {formatTime(duration)}
              </motion.p>
            )}
          </div>
          <button onClick={() => setMusicOn(v => !v)}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all ${
              musicOn ? "bg-white/20 border-white/30 shadow-sm" : "bg-transparent border-white/15 text-white/40"
            }`}>
            {musicOn ? <Music className="w-4 h-4 text-white/80" /> : <Music2 className="w-4 h-4 text-white/40" />}
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════════ DONE SCREEN ══════════════ */}
          {state === "done" && (
            <motion.div key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${c1}88, ${c2}88)`, boxShadow: `0 0 60px ${c1}55` }}
              >🌿</motion.div>

              <div className="text-center">
                <p className="text-white text-2xl font-bold">Session Complete</p>
                <p className="text-white/50 text-sm mt-1">{formatTime(elapsed)} of mindful breathing</p>
              </div>

              <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5">
                <p className="text-white/80 text-sm font-semibold mb-4 text-center">How do you feel now?</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[["much_better", "Much Better", "😊"], ["better", "Better", "🙂"], ["same", "About the Same", "😐"], ["worse", "A Bit Lower", "😔"]].map(([val, label, emoji]) => (
                    <button key={val} onClick={() => setPostMood(val)}
                      className={`py-3 rounded-2xl text-sm border transition-all flex items-center justify-center gap-2 font-medium ${
                        postMood === val
                          ? "bg-white/25 border-white/40 text-white shadow-sm"
                          : "bg-white/8 border-white/15 text-white/50"
                      }`}>
                      <span>{emoji}</span> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full space-y-2.5">
                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => { saveMutation.mutate({ exercise_type: exercise.id, duration_seconds: elapsed, post_mood: postMood || "same" }); navigate(createPageUrl("GratitudeWall")); }}
                  className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-xl flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${c1}cc, ${c2}cc)` }}
                >
                  🌱 Continue to Gratitude Wall
                </motion.button>
                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => { saveMutation.mutate({ exercise_type: exercise.id, duration_seconds: elapsed, post_mood: postMood || "same" }); stopSession(); }}
                  className="w-full py-3.5 rounded-2xl text-white/70 text-sm font-semibold bg-white/10 border border-white/20"
                >
                  Continue Session
                </motion.button>
                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => { saveMutation.mutate({ exercise_type: exercise.id, duration_seconds: elapsed, post_mood: postMood || "same" }); navigate(createPageUrl("Home")); }}
                  className="w-full py-3 rounded-2xl text-white/40 text-sm"
                >
                  Return Home
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══════════════ IDLE — SETUP SCREEN ══════════════ */}
          {state === "idle" && (
            <motion.div key="idle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex-1 flex flex-col px-5 pb-8 overflow-y-auto"
            >
              <div className="mb-6 mt-2">
                <p className="text-white/90 text-xl font-bold">Choose your rhythm</p>
                <p className="text-white/40 text-sm mt-0.5">Each pattern offers a different kind of calm</p>
              </div>

              {/* Exercise picker */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {EXERCISES.map((ex, idx) => (
                  <motion.button key={ex.id}
                    whileTap={{ scale: 0.94 }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => setExercise(ex)}
                    className={`p-4 rounded-3xl text-left border transition-all relative overflow-hidden ${
                      exercise.id === ex.id
                        ? "bg-white/20 border-white/35 shadow-lg"
                        : "bg-white/8 border-white/12 hover:bg-white/14"
                    }`}
                  >
                    {exercise.id === ex.id && (
                      <motion.div
                        className="absolute inset-0 bg-white/8"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <motion.span
                        animate={exercise.id === ex.id ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >{ex.emoji}</motion.span>
                      <p className="text-white/90 font-bold text-sm">{ex.label}</p>
                    </div>
                    <p className="text-white/45 text-[10px] leading-relaxed relative z-10">{ex.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Duration picker */}
              <div className="mb-8">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">Session duration</p>
                <div className="flex gap-2">
                  {DURATIONS.map(d => (
                    <button key={d.s} onClick={() => setDuration(d.s)}
                      className={`flex-1 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                        duration === d.s
                          ? "bg-white/20 border-white/30 text-white shadow-sm"
                          : "bg-white/8 border-white/15 text-white/40"
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start button */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.02 }}
                onClick={startSession}
                className="w-full py-5 rounded-3xl text-white font-bold text-base shadow-2xl relative overflow-hidden flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${c1}cc, ${c2}cc)`, boxShadow: `0 8px 32px ${c1}55` }}
              >
                <motion.div className="absolute inset-0 bg-white/10"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="relative z-10 text-xl">🌬️</motion.span>
                <span className="relative z-10">Begin Session</span>
              </motion.button>
            </motion.div>
          )}

          {/* ══════════════ RUNNING / PAUSED ══════════════ */}
          {(state === "running" || state === "paused") && (
            <motion.div key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-5 pb-8"
            >

              {/* Phase label */}
              <AnimatePresence mode="wait">
                <motion.div key={phaseName}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-12 text-center"
                >
                  {state === "paused" ? (
                    <p className="text-white/60 text-lg font-light tracking-[0.3em] uppercase">Paused</p>
                  ) : (
                    <>
                      <p className="text-white text-3xl font-light tracking-[0.25em] uppercase mb-2">{phaseName}</p>
                      <p className="text-white/40 text-sm font-mono tracking-widest">{phaseTime - phaseElapsed}s</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ORB */}
              <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>

                {/* Outer glow rings */}
                <GlowRing scale={1.5} color={c1} delay={0} />
                <GlowRing scale={1.8} color={c2} delay={1} />

                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <motion.circle
                    cx="50" cy="50" r="47" fill="none"
                    stroke={c1} strokeWidth="1" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 47}
                    animate={{ strokeDashoffset: 2 * Math.PI * 47 * (1 - progress) }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    opacity={0.5}
                  />
                </svg>

                {/* Main orb */}
                <motion.div
                  className="rounded-full flex items-center justify-center relative"
                  style={{ width: 160, height: 160 }}
                  animate={{
                    scale: state === "paused" ? [1, 1.03, 1] : orbScale,
                    boxShadow: state === "paused"
                      ? `0 0 40px ${c1}33`
                      : `0 0 ${40 + glowIntensity * 60}px ${c1}${Math.round(glowIntensity * 99).toString(16).padStart(2, "0")}`,
                  }}
                  transition={state === "paused"
                    ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    : { duration: phaseTime, ease: "easeInOut" }
                  }
                >
                  {/* Orb inner layers */}
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${c1}cc, ${c2}99)` }} />
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), transparent 60%)" }} />
                  {/* Highlight dot */}
                  <div className="absolute top-6 left-8 w-5 h-3 rounded-full bg-white/25 blur-sm" />
                </motion.div>
              </div>

              {/* Instruction below */}
              <div className="mt-12 text-center">
                <p className="text-white/30 text-xs tracking-widest uppercase font-medium">
                  {exercise.desc}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-4 mt-10">
                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={state === "running" ? pauseSession : resumeSession}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${c1}cc, ${c2}cc)`, boxShadow: `0 4px 24px ${c1}44` }}
                >
                  {state === "running"
                    ? <Pause className="w-6 h-6 text-white" />
                    : <Play className="w-6 h-6 text-white ml-0.5" />
                  }
                </motion.button>

                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={stopSession}
                  className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center self-center"
                >
                  <RotateCcw className="w-5 h-5 text-white/60" />
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── MUSIC PROMPT MODAL ── */}
      <AnimatePresence>
        {showMusicPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => confirmStart(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 text-center space-y-4"
            >
              <span className="text-4xl block">🎵</span>
              <p className="text-white font-bold text-lg">Add calming background sound?</p>
              <p className="text-white/50 text-sm">Ambient music can deepen your calm experience</p>
              <div className="flex gap-3">
                <button onClick={() => confirmStart(true)}
                  className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm"
                  style={{ background: `linear-gradient(135deg, ${c1}bb, ${c2}bb)` }}>
                  Yes, please 🎶
                </button>
                <button onClick={() => confirmStart(false)}
                  className="flex-1 py-3.5 rounded-2xl text-white/60 font-semibold text-sm bg-white/10 border border-white/20">
                  Silence
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}