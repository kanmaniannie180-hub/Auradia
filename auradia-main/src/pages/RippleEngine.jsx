import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { ChevronLeft, Mic, MicOff, Sparkles, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { matchScenario } from "@/lib/rippleScenarios";
import RippleVisualization from "@/components/rippleEngine/RippleVisualization";
import EffectCards from "@/components/rippleEngine/EffectCards";
import RecommendationCard from "@/components/rippleEngine/RecommendationCard";
import ContextInput from "@/components/rippleEngine/ContextInput";
import moment from "moment";

const RECOMMENDATION_COLORS = {
  proceed: "#34d399",
  think: "#fbbf24",
  wait: "#a855f7",
};

export default function RippleEngine() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [context, setContext] = useState({ relationship: null, personality: null, emotion: null });
  const [result, setResult] = useState(null);
  const [showContext, setShowContext] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [step, setStep] = useState("input"); // "input" | "result"

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  // Load past moods for personalization context
  const { data: recentMoods = [] } = useQuery({
    queryKey: ["moods-all"],
    queryFn: () => base44.entities.Mood.list("-created_date", 20),
  });

  // Personalization: detect impulsive pattern
  const negMoods = recentMoods.filter(m => ["stressed", "angry", "anxious"].includes(m.emotion));
  const isHighStress = negMoods.length >= 3 && negMoods.slice(0, 5).filter(m => ["stressed","angry","anxious"].includes(m.emotion)).length >= 3;

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      // For voice: just set a placeholder since we can't do STT without backend
      setInput(prev => prev + (prev ? " " : "") + "[voice note added]");
    };
    mr.start();
    mediaRef.current = mr;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  const analyze = () => {
    if (!input.trim()) return;
    const scenario = matchScenario(input);

    // Personalization adjustments
    let adjusted = { ...scenario };
    if (isHighStress && adjusted.recommendation === "proceed") {
      adjusted = {
        ...adjusted,
        recommendation: "think",
        advice: "Your recent pattern shows high stress. Give yourself a moment before acting — " + adjusted.advice,
      };
    }
    if (context.emotion === "angry" && adjusted.recommendation === "proceed") {
      adjusted = {
        ...adjusted,
        recommendation: "think",
        advice: "Acting from anger rarely achieves the outcome you want. " + adjusted.advice,
      };
    }
    if (context.personality === "sensitive" && !adjusted.negative.includes("May hurt their feelings deeply")) {
      adjusted = {
        ...adjusted,
        negative: ["May hurt their feelings deeply", ...adjusted.negative],
        score: { ...adjusted.score, negative: adjusted.score.negative + 1 },
      };
    }

    setResult(adjusted);
    setStep("result");
  };

  const reset = () => {
    setInput("");
    setContext({ relationship: null, personality: null, emotion: null });
    setResult(null);
    setStep("input");
    setShowContext(false);
  };

  const rippleColor = result ? RECOMMENDATION_COLORS[result.recommendation] || "#a855f7" : "#a855f7";

  return (
    <AnimatedBackground mood={context.emotion || "default"}>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-36 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(createPageUrl("More"))}
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step === "result" && (
            <button onClick={reset}
              className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold hover:text-gray-600 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Start over
            </button>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌊</span>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Ripple Effects</h1>
          </div>
          <p className="text-sm text-gray-400">Think before you act. See the waves.</p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── INPUT STEP ── */}
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              className="space-y-4">

              {/* Personalization banner */}
              {isHighStress && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2">
                  <span className="text-base flex-shrink-0">💛</span>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    You've been under stress lately. I'll help you think carefully before acting.
                  </p>
                </motion.div>
              )}

              {/* Main input */}
              <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl p-4 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">What are you thinking of doing?</p>
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="e.g. I want to confront my friend about what they said…"
                  className="bg-white/40 border-white/50 rounded-2xl resize-none h-24 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-purple-300 mb-3"
                />

                {/* Voice button */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isRecording ? "bg-red-500 text-white border-red-400" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <motion.div className="w-2 h-2 rounded-full bg-white" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                      <MicOff className="w-3.5 h-3.5" /> Stop recording
                    </>
                  ) : (
                    <><Mic className="w-3.5 h-3.5" /> Speak instead</>
                  )}
                </motion.button>
              </div>

              {/* Context toggle */}
              <button onClick={() => setShowContext(p => !p)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/40 border border-white/50 text-xs font-semibold text-gray-500 hover:bg-white/60 transition-colors">
                <span>Add context (optional)</span>
                {showContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showContext && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-4">
                      <ContextInput context={context} onChange={setContext} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyze button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={analyze}
                disabled={!input.trim()}
                className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-lg disabled:opacity-40 relative overflow-hidden flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}
              >
                <motion.div className="absolute inset-0 bg-white/10"
                  animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity }} />
                <Sparkles className="w-4 h-4 relative z-10" />
                <span className="relative z-10">See the Ripples</span>
              </motion.button>
            </motion.div>
          )}

          {/* ── RESULT STEP ── */}
          {step === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">

              {/* What you said */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl px-4 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">You're thinking of…</p>
                <p className="text-sm text-gray-700 leading-relaxed italic">"{input}"</p>
                {context.emotion && (
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    Feeling: {["angry","sad","anxious","excited","calm","hurt","hopeful","confused"].includes(context.emotion) ? context.emotion : ""} ·
                    {context.relationship ? ` About: ${context.relationship}` : ""}
                    {context.personality ? ` (${context.personality})` : ""}
                  </p>
                )}
              </div>

              {/* Ripple visualization */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-4">
                <RippleVisualization score={result.score} color={rippleColor} />
              </div>

              {/* Effect cards */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-4">
                <EffectCards positive={result.positive} negative={result.negative} />
              </div>

              {/* Impact summary */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Relationship Impact", value: result.relationshipImpact, emoji: "💬" },
                  { label: "Emotional Impact", value: result.emotionalImpact, emoji: "🫀" },
                ].map(item => (
                  <div key={item.label} className="bg-white/40 border border-white/50 rounded-2xl p-3 text-center">
                    <span className="text-lg block mb-1">{item.emoji}</span>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-bold text-gray-700 capitalize mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <RecommendationCard
                recommendation={result.recommendation}
                advice={result.advice}
                followUp={result.followUp}
              />

              {/* Disclaimer */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
                This is a reflection tool, not a verdict. You always know your situation best. 💜
              </motion.p>

              {/* Try again */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={reset}
                className="w-full py-3 rounded-2xl border border-purple-200 text-purple-600 text-sm font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Analyze another situation
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedBackground>
  );
}