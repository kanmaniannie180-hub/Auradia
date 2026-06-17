import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { ChevronRight, Sparkles } from "lucide-react";
import Card3D from "@/components/shared/Card3D";

const FEATURES = [
  { label: "Ripple Effects",  emoji: "🌊", desc: "Predict emotional consequences", page: "RippleEngine",     color: "from-indigo-100 to-purple-100", border: "border-indigo-200/60",  glow: "rgba(99,102,241,0.25)",   tag: "AI" },
  { label: "Time Capsule",    emoji: "🔐", desc: "Messages to your future self",   page: "TimeCapsule",      color: "from-violet-100 to-pink-100",   border: "border-violet-200/60",  glow: "rgba(167,139,250,0.25)",  tag: "Memory" },
  { label: "Positive Ripple", emoji: "🌱", desc: "Small actions, big impact",       page: "PositiveRipple",   color: "from-teal-100 to-cyan-100",     border: "border-teal-200/60",    glow: "rgba(45,212,191,0.25)",   tag: "Growth" },
  { label: "Community",       emoji: "🫂", desc: "Anonymous sharing space",         page: "AnonymousSharing", color: "from-rose-100 to-pink-100",     border: "border-rose-200/60",    glow: "rgba(251,113,133,0.25)",  tag: "Social" },
  { label: "Voice Journal",   emoji: "🎙️", desc: "Express through voice",          page: "VoiceJournal",     color: "from-amber-100 to-orange-100",  border: "border-amber-200/60",   glow: "rgba(251,146,60,0.25)",   tag: "Journal" },
  { label: "Nudge AI",        emoji: "✨", desc: "Gentle encouragement",            page: "NudgeAI",          color: "from-yellow-100 to-lime-100",   border: "border-yellow-200/60",  glow: "rgba(250,204,21,0.25)",   tag: "AI" },
  { label: "AI Mood Coach",   emoji: "🤖", desc: "Supportive conversation",         page: "AIMoodCoach",      color: "from-teal-100 to-emerald-100",  border: "border-teal-200/60",    glow: "rgba(52,211,153,0.25)",   tag: "AI" },
  { label: "Gratitude Wall",  emoji: "🌸", desc: "Things that matter",              page: "GratitudeWall",    color: "from-green-100 to-emerald-100", border: "border-green-200/60",   glow: "rgba(52,211,153,0.2)",    tag: "Self" },
  { label: "Emotional Map",   emoji: "🗺️", desc: "Your mood history",              page: "EmotionalMap",     color: "from-indigo-100 to-blue-100",   border: "border-indigo-200/60",  glow: "rgba(99,102,241,0.2)",    tag: "Insights" },
];

const TAG_STYLES = {
  AI:       "bg-violet-100 text-violet-600 border-violet-200",
  Memory:   "bg-indigo-100 text-indigo-600 border-indigo-200",
  Growth:   "bg-teal-100 text-teal-600 border-teal-200",
  Social:   "bg-rose-100 text-rose-600 border-rose-200",
  Journal:  "bg-amber-100 text-amber-600 border-amber-200",
  Self:     "bg-green-100 text-green-600 border-green-200",
  Insights: "bg-blue-100 text-blue-600 border-blue-200",
};

export default function More() {
  const navigate = useNavigate();

  return (
    <AnimatedBackground>
      <div className="max-w-lg mx-auto px-4 pt-8 pb-32">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Explore</h1>
          </div>
          <p className="text-sm text-gray-400 pl-7">Your complete wellbeing toolkit</p>
        </motion.div>

        {/* Feature cards — top 2 as big cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {FEATURES.slice(0, 2).map((f, i) => (
            <motion.div
              key={f.page}
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 280 }}
            >
              <Card3D
                glowColor={f.glow}
                intensity={12}
                onClick={() => navigate(createPageUrl(f.page))}
                className={`rounded-3xl bg-gradient-to-br ${f.color} border ${f.border} p-5 text-left shadow-sm cursor-pointer h-full`}
              >
                <div className="flex items-start justify-between mb-3">
                  <motion.span
                    animate={{ y: [0, -5, 0], rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity }}
                    className="text-3xl block"
                  >{f.emoji}</motion.span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${TAG_STYLES[f.tag]}`}>{f.tag}</span>
                </div>
                <p className="text-sm font-bold text-gray-800">{f.label}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{f.desc}</p>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3"
        >
          All Tools
        </motion.p>

        {/* Remaining features list */}
        <div className="space-y-2.5">
          {FEATURES.slice(2).map((f, i) => (
            <motion.button
              key={f.page}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.05, type: "spring", stiffness: 260 }}
              whileHover={{ x: 4, boxShadow: `0 8px 24px ${f.glow}`, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(createPageUrl(f.page))}
              className="w-full rounded-2xl bg-white/55 backdrop-blur-xl border border-white/65 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-4 py-3.5 flex items-center gap-4 text-left transition-all"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} flex items-center justify-center text-xl flex-shrink-0 shadow-sm`}
              >
                {f.emoji}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-700">{f.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{f.desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${TAG_STYLES[f.tag]}`}>{f.tag}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedBackground>
  );
}