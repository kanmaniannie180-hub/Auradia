import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { ChevronLeft, Sparkles, RefreshCw, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";

// ─── Nudge type visual configs ────────────────────────────────────────────
const NUDGE_STYLES = {
  calming: {
    gradient: "from-sky-50/95 via-cyan-50/80 to-blue-50/70",
    border: "border-sky-200/60",
    glow: "shadow-sky-100",
    badge: "bg-sky-100 text-sky-700",
    btnGrad: "from-sky-400 to-cyan-500",
    emoji: "🌬️",
    label: "Calming",
  },
  motivational: {
    gradient: "from-amber-50/95 via-yellow-50/80 to-orange-50/70",
    border: "border-amber-200/60",
    glow: "shadow-amber-100",
    badge: "bg-amber-100 text-amber-700",
    btnGrad: "from-amber-400 to-orange-500",
    emoji: "🔥",
    label: "Motivational",
  },
  reflective: {
    gradient: "from-indigo-50/95 via-violet-50/80 to-purple-50/70",
    border: "border-indigo-200/60",
    glow: "shadow-indigo-100",
    badge: "bg-indigo-100 text-indigo-700",
    btnGrad: "from-indigo-400 to-violet-500",
    emoji: "💭",
    label: "Reflective",
  },
  reassuring: {
    gradient: "from-rose-50/95 via-pink-50/80 to-fuchsia-50/70",
    border: "border-rose-200/60",
    glow: "shadow-rose-100",
    badge: "bg-rose-100 text-rose-700",
    btnGrad: "from-rose-400 to-pink-500",
    emoji: "💜",
    label: "Reassuring",
  },
  celebratory: {
    gradient: "from-emerald-50/95 via-teal-50/80 to-green-50/70",
    border: "border-emerald-200/60",
    glow: "shadow-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
    btnGrad: "from-emerald-400 to-teal-500",
    emoji: "🌱",
    label: "Celebratory",
  },
  corrective: {
    gradient: "from-slate-50/95 via-gray-50/80 to-zinc-50/70",
    border: "border-slate-200/60",
    glow: "shadow-slate-100",
    badge: "bg-slate-100 text-slate-700",
    btnGrad: "from-slate-400 to-gray-500",
    emoji: "🌙",
    label: "Pause & Reflect",
  },
};

// Page label map for suggested_page values
const PAGE_LABELS = {
  CalmZone: { label: "Open Calm Zone", emoji: "🌬️" },
  AIMoodCoach: { label: "Talk to Mood Coach", emoji: "💜" },
  GratitudeWall: { label: "Gratitude Wall", emoji: "🌱" },
  EmotionalMap: { label: "View Emotional Map", emoji: "🗺️" },
  RippleEngine: { label: "Ripple Effects", emoji: "🌊" },
  VoiceJournal: { label: "Voice Journal", emoji: "🎙️" },
  TimeCapsule: { label: "Time Capsule", emoji: "🔐" },
  PositiveRipple: { label: "Positive Ripple", emoji: "⚡" },
};

// Build rich context string for the LLM
function buildNudgePrompt({ moods, voiceEntries, ripples, capsules, nudges }) {
  const hour = new Date().getHours();
  const timeCtx = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";

  const moodSummary = moods.length
    ? moods.slice(0, 5).map(m => `${m.emotion}(${m.intensity}/5)`).join(", ")
    : "no mood data";

  const voiceSummary = voiceEntries.length
    ? voiceEntries.slice(0, 3).map(e => `${e.detected_emotion || "unknown"} - ${e.intensity || "?"}`).join(", ")
    : "no voice data";

  const rippleSummary = ripples.filter(r => r.status === "completed").length
    ? `${ripples.filter(r => r.status === "completed").length} positive ripples completed recently`
    : "no completed ripples";

  const openedCapsules = capsules.filter(c => c.status === "opened").length;
  const capsuleSummary = openedCapsules > 0
    ? `${openedCapsules} time capsule(s) opened — user has been reflecting on past growth`
    : "no opened time capsules";

  // Check if similar mood pattern appeared a week ago
  const weekAgo = moment().subtract(7, "days");
  const lastWeekMoods = moods.filter(m => moment(m.created_date).isBefore(weekAgo));
  const memoryHint = lastWeekMoods.length
    ? `A week ago the user felt: ${lastWeekMoods.slice(0, 2).map(m => m.emotion).join(", ")}.`
    : "";

  const negativeEmotions = ["sad", "stressed", "angry", "anxious", "lonely", "overwhelmed"];
  const recentNegCount = moods.slice(0, 4).filter(m => negativeEmotions.includes(m.emotion)).length;
  const dominantPattern = recentNegCount >= 3 ? "struggling" : recentNegCount >= 2 ? "mixed" : "generally positive";

  return `You are Auradia's Nudge AI — a deeply empathetic inner voice, not a chatbot.

Your job is to craft ONE personal, emotionally intelligent nudge for this user.

USER CONTEXT:
- Time of day: ${timeCtx}
- Recent mood pattern: ${moodSummary}
- Emotional pattern: ${dominantPattern}
- Voice journal data: ${voiceSummary}
- ${rippleSummary}
- ${capsuleSummary}
${memoryHint ? `- Memory: ${memoryHint}` : ""}

NUDGE TYPES available:
- calming: for stress/anxiety/overwhelm — soft, grounding
- motivational: for low energy/sadness — uplifting, gentle fire
- reflective: for confusion/fluctuation — curious, open questions
- reassuring: for fear/loneliness — warm, unconditional
- celebratory: for positive patterns/growth — acknowledge progress
- corrective: for impulsive/avoidant patterns — gentle pause nudge

RULES:
1. Message must feel deeply personal, not generic
2. Max 2 sentences — every word must earn its place
3. No commands — only invitations
4. No medical language
5. If user had similar feelings last week, acknowledge it gently (e.g. "This isn't the first time...")
6. The suggested_action should be poetic and kind, not task-like
7. Only suggest a page if it genuinely fits — don't force it

Output JSON only.`;
}

// ─── Component ────────────────────────────────────────────────────────────
export default function NudgeAI() {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const [nudge, setNudge]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { data: moods = [] }        = useQuery({ queryKey: ["moods"],         queryFn: () => base44.entities.Mood.list("-created_date", 10) });
  const { data: voiceEntries = [] } = useQuery({ queryKey: ["voice-entries"],  queryFn: () => base44.entities.VoiceEntry.list("-created_date", 5) });
  const { data: ripples = [] }      = useQuery({ queryKey: ["ripples"],        queryFn: () => base44.entities.Ripple.list("-created_date", 10) });
  const { data: capsules = [] }     = useQuery({ queryKey: ["capsules"],       queryFn: () => base44.entities.TimeCapsule.list("-created_date", 10) });
  const { data: nudgeHistory = [] } = useQuery({ queryKey: ["nudges"],         queryFn: () => base44.entities.NudgeLog.list("-created_date", 20) });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.NudgeLog.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["nudges"] }),
  });

  const requestNudge = async () => {
    setLoading(true);
    setNudge(null);

    const prompt = buildNudgePrompt({ moods, voiceEntries, ripples, capsules, nudges: nudgeHistory });

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          nudge_type: { type: "string", enum: ["calming", "motivational", "reflective", "reassuring", "celebratory", "corrective"] },
          message: { type: "string" },
          suggested_action: { type: "string" },
          suggested_page: { type: "string", enum: ["CalmZone", "AIMoodCoach", "GratitudeWall", "EmotionalMap", "RippleEngine", "VoiceJournal", "TimeCapsule", "PositiveRipple", ""] },
          memory_reference: { type: "string" },
        },
      },
    });

    setNudge(result);
    saveMutation.mutate({
      message: result.message,
      category: result.nudge_type || "encouragement",
      suggested_action: result.suggested_action,
    });
    setLoading(false);
  };

  const style = NUDGE_STYLES[nudge?.nudge_type] || NUDGE_STYLES.reassuring;
  const pageInfo = PAGE_LABELS[nudge?.suggested_page];

  return (
    <AnimatedBackground>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-32 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(createPageUrl("Home"))} className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {nudgeHistory.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/50 border border-white/60 text-xs text-gray-500 font-medium hover:bg-white/70 transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              {showHistory ? "Hide history" : "Past nudges"}
            </motion.button>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <div className="flex items-center gap-2.5 mb-1">
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200/60 flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Nudge AI</h1>
          </div>
          <p className="text-sm text-gray-400 pl-11">Your trusted inner voice</p>
        </motion.div>

        {/* ── Main nudge area ── */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">

            {/* Loading */}
            {loading && (
              <motion.div key="loading"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="py-16 flex flex-col items-center gap-6 w-full"
              >
                <div className="relative">
                  <motion.div
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ boxShadow: "0 0 50px rgba(168,85,247,0.35)" }}
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  {/* Outer glow rings */}
                  {[1.4, 1.7].map((s, i) => (
                    <motion.div key={i}
                      className="absolute inset-0 rounded-full border border-purple-300/30"
                      animate={{ scale: [1, s], opacity: [0.4, 0] }}
                      transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Listening to your patterns…</p>
                  <div className="flex justify-center gap-1.5 mt-3">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-300"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, delay: i * 0.22, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Nudge card */}
            {!loading && nudge && (
              <motion.div key="nudge"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="w-full space-y-3"
              >
                <div className={`rounded-3xl bg-gradient-to-br ${style.gradient} border ${style.border} p-6 shadow-lg ${style.glow}`}
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}
                >
                  {/* Type badge */}
                  <div className="flex items-center gap-2 mb-5">
                    <motion.span
                      className="text-2xl"
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >{style.emoji}</motion.span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>

                  {/* Memory reference (if present) */}
                  {nudge.memory_reference && (
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                      className="text-xs text-gray-400 italic mb-2 leading-relaxed"
                    >
                      {nudge.memory_reference}
                    </motion.p>
                  )}

                  {/* Main message */}
                  <motion.p
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="text-base text-gray-800 leading-relaxed font-medium"
                  >
                    {nudge.message}
                  </motion.p>

                  {/* Suggested action */}
                  {nudge.suggested_action && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="mt-4 bg-white/50 backdrop-blur-sm border border-white/70 rounded-2xl px-4 py-3"
                    >
                      <p className="text-xs text-gray-500 leading-relaxed italic">
                        ✦ {nudge.suggested_action}
                      </p>
                    </motion.div>
                  )}

                  {/* Action button */}
                  {pageInfo && nudge.suggested_page && (
                    <motion.button
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate(createPageUrl(nudge.suggested_page))}
                      className="mt-4 w-full py-3.5 rounded-2xl text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${style.btnGrad} rounded-2xl`} />
                      <span className="relative z-10">{pageInfo.emoji}</span>
                      <span className="relative z-10">{pageInfo.label}</span>
                      <ArrowRight className="w-4 h-4 relative z-10" />
                    </motion.button>
                  )}
                </div>

                {/* Another nudge */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={requestNudge}
                  className="w-full py-3 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 text-gray-500 text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/70 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Another nudge
                </motion.button>
              </motion.div>
            )}

            {/* Start screen */}
            {!loading && !nudge && (
              <motion.div key="start"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-10 text-center w-full"
              >
                <div className="relative w-32 h-32 mx-auto mb-7">
                  {/* Glow rings */}
                  {[1.3, 1.6, 1.9].map((s, i) => (
                    <motion.div key={i}
                      className="absolute inset-0 rounded-full border border-purple-300/20"
                      animate={{ scale: [1, s], opacity: [0.4, 0] }}
                      transition={{ duration: 3, delay: i * 0.9, repeat: Infinity }}
                    />
                  ))}
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center shadow-xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ boxShadow: "0 0 50px rgba(168,85,247,0.3)" }}
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>
                </div>

                <p className="text-gray-700 font-semibold text-base mb-1.5">Your inner guide awaits</p>
                <p className="text-xs text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
                  Personalized to your emotional patterns, your history, and this moment.
                </p>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={requestNudge}
                  className="px-10 py-4 rounded-2xl text-white font-bold text-sm shadow-lg shadow-purple-200 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
                >
                  <motion.div className="absolute inset-0 bg-white/10"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                  <span className="relative z-10">Nudge me ✨</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Nudge history ── */}
        <AnimatePresence>
          {showHistory && nudgeHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              className="mt-8"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Past nudges</p>
              <div className="space-y-2.5">
                {nudgeHistory.slice(0, 8).map((n, i) => {
                  const s = NUDGE_STYLES[n.category] || NUDGE_STYLES.reassuring;
                  return (
                    <motion.div key={n.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white/40 backdrop-blur-xl border border-white/55 rounded-2xl px-4 py-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg flex-shrink-0 mt-0.5">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{moment(n.created_date).fromNow()}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedBackground>
  );
}