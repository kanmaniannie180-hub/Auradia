import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Check, RefreshCw, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";

const RIPPLE_SUGGESTIONS = {
  self_care: ["Drink a glass of water mindfully", "Stretch for 2 minutes", "Take 5 deep breaths", "Step outside briefly"],
  kindness: ["Message someone you appreciate", "Compliment a stranger today", "Help someone with a small task", "Send a thank you note"],
  mindfulness: ["Notice 3 things you can see right now", "Listen to a sound for 30 seconds", "Feel the texture of what you're touching", "Take a mindful bite of food"],
  health: ["Walk for 5 minutes", "Eat a fruit", "Stand up and stretch", "Drink herbal tea"],
  reflection: ["Write down one thing you learned today", "Think about a happy memory", "Consider what you're grateful for", "Reflect on a challenge you overcame"],
  growth: ["Learn one new word", "Read one page of a book", "Try something slightly different", "Set one small intention"],
};

const CATEGORY_CONFIG = {
  self_care: { color: "from-teal-100 to-cyan-50", border: "border-teal-200/60", text: "text-teal-700", emoji: "💆", label: "Self Care" },
  kindness: { color: "from-pink-100 to-rose-50", border: "border-pink-200/60", text: "text-rose-700", emoji: "💝", label: "Kindness" },
  mindfulness: { color: "from-purple-100 to-violet-50", border: "border-purple-200/60", text: "text-violet-700", emoji: "🧘", label: "Mindfulness" },
  health: { color: "from-green-100 to-emerald-50", border: "border-green-200/60", text: "text-emerald-700", emoji: "🌿", label: "Health" },
  reflection: { color: "from-blue-100 to-indigo-50", border: "border-blue-200/60", text: "text-indigo-700", emoji: "💭", label: "Reflection" },
  growth: { color: "from-orange-100 to-amber-50", border: "border-orange-200/60", text: "text-amber-700", emoji: "🌱", label: "Growth" },
};

export default function PositiveRipple() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentRipple, setCurrentRipple] = useState(null);
  const [completionNote, setCompletionNote] = useState("");
  const [showComplete, setShowComplete] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { data: ripples = [] } = useQuery({
    queryKey: ["ripples"],
    queryFn: () => base44.entities.Ripple.list("-created_date", 30),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Ripple.create(data),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["ripples"] }); setCurrentRipple(data); },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, note }) => base44.entities.Ripple.update(id, { status: "completed", completion_note: note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ripples"] });
      setCompleted(true);
      setTimeout(() => { setCompleted(false); setCurrentRipple(null); setCompletionNote(""); setShowComplete(false); }, 2200);
    },
  });

  const generateRipple = () => {
    const categories = Object.keys(RIPPLE_SUGGESTIONS);
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const actions = RIPPLE_SUGGESTIONS[cat];
    createMutation.mutate({ action_text: actions[Math.floor(Math.random() * actions.length)], category: cat, status: "accepted" });
  };

  const completedToday = ripples.filter(r => new Date(r.created_date).toDateString() === new Date().toDateString() && r.status === "completed");

  return (
    <AnimatedBackground>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-32 min-h-screen">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(createPageUrl("Home"))} className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {completedToday.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> {completedToday.length} today
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2.5 mb-1">
            <motion.span animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-2xl">🌊</motion.span>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Positive Ripple</h1>
          </div>
          <p className="text-sm text-gray-400 pl-9">Small actions, meaningful impact</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center py-16 gap-5">
              <div className="relative">
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-300 to-emerald-400 flex items-center justify-center shadow-xl">
                  <Check className="w-12 h-12 text-white" strokeWidth={2.5} />
                </motion.div>
                {[1, 2, 3].map(i => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-teal-300/40"
                    initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                    transition={{ duration: 1.8, delay: i * 0.25, repeat: Infinity }} />
                ))}
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">Ripple sent! 🌊</p>
                <p className="text-sm text-gray-400 mt-1">Your small action matters</p>
              </div>
            </motion.div>
          ) : currentRipple ? (
            <motion.div key="active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {(() => {
                const cfg = CATEGORY_CONFIG[currentRipple.category] || CATEGORY_CONFIG.growth;
                return (
                  <>
                    <div className={`rounded-3xl bg-gradient-to-br ${cfg.color} border ${cfg.border} p-6 mb-4 shadow-sm`}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{cfg.emoji}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 leading-snug">{currentRipple.action_text}</p>
                    </div>
                    {showComplete ? (
                      <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm">
                        <p className="text-sm font-medium text-gray-600 mb-3">How did it feel?</p>
                        <Textarea value={completionNote} onChange={(e) => setCompletionNote(e.target.value)}
                          placeholder="Optional reflection..." className="bg-white/40 border-white/50 rounded-2xl resize-none h-20 text-sm mb-3 focus:ring-1 focus:ring-purple-300" />
                        <button onClick={() => completeMutation.mutate({ id: currentRipple.id, note: completionNote })}
                          disabled={completeMutation.isPending}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-md">
                          Complete Ripple 🌊
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setShowComplete(true)}
                          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> I did it!
                        </button>
                        <button onClick={() => { setCurrentRipple(null); generateRipple(); }}
                          className="w-14 h-14 rounded-2xl bg-white/50 border border-white/60 flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          ) : (
            <motion.div key="start" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <div className="relative w-36 h-36 mx-auto mb-7">
                {[1.25, 1.5, 1.75].map((s, i) => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border border-teal-300/30"
                    animate={{ scale: [1, s], opacity: [0.5, 0] }}
                    transition={{ duration: 3, delay: i * 0.8, repeat: Infinity }} />
                ))}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-36 h-36 rounded-full bg-gradient-to-br from-teal-200 to-emerald-200 flex items-center justify-center shadow-xl border border-teal-100"
                  style={{ boxShadow: "0 0 40px rgba(52,211,153,0.3)" }}
                >
                  <span className="text-5xl">🌊</span>
                </motion.div>
              </div>
              <p className="text-gray-700 font-bold text-base mb-1">Ready for a small positive action?</p>
              <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">Takes 2–15 minutes and genuinely makes a difference</p>
              <motion.button
                whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.03 }}
                onClick={generateRipple}
                disabled={createMutation.isPending}
                className="px-10 py-4 rounded-2xl text-white text-sm font-bold shadow-lg flex items-center gap-2 mx-auto relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)", boxShadow: "0 6px 24px rgba(52,211,153,0.4)" }}
              >
                <motion.div className="absolute inset-0 bg-white/10" animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity }} />
                <Zap className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Get a Ripple ✨</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {ripples.filter(r => r.status === "completed").length > 0 && !currentRipple && (
          <div className="mt-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent ripples</p>
            <div className="space-y-2">
              {ripples.filter(r => r.status === "completed").slice(0, 8).map((r, i) => {
                const cfg = CATEGORY_CONFIG[r.category] || CATEGORY_CONFIG.growth;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl px-4 py-3 flex items-center gap-3">
                      <span className="text-xl flex-shrink-0">{cfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{r.action_text}</p>
                        <p className="text-[10px] text-gray-400">{moment(r.created_date).fromNow()}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}