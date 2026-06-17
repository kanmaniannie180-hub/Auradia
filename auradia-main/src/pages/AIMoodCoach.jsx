import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { ChevronLeft, Send, Mic, MicOff, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import { buildCoachContext, FEATURE_SUGGESTIONS } from "@/lib/coachResponses";

const PROMPTS = [
  { text: "I feel stressed 😰", color: "from-rose-100 to-pink-100", border: "border-rose-200/60" },
  { text: "I feel really low 💙", color: "from-indigo-100 to-blue-100", border: "border-indigo-200/60" },
  { text: "I'm overwhelmed 😤", color: "from-orange-100 to-amber-100", border: "border-orange-200/60" },
  { text: "I feel anxious 😟", color: "from-violet-100 to-purple-100", border: "border-violet-200/60" },
  { text: "I'm feeling happy 😊", color: "from-yellow-100 to-amber-100", border: "border-yellow-200/60" },
  { text: "I need clarity 🌟", color: "from-teal-100 to-cyan-100", border: "border-teal-200/60" },
];

const AURADIA_AVATAR = (
  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-md">
    💜
  </div>
);

export default function AIMoodCoach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there 💜 I'm Auradia, your personal mood companion. I'm here to listen, support, and gently guide you — no judgment, just care.\n\nHow are you feeling right now?",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [featureSuggestion, setFeatureSuggestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const scrollRef = useRef(null);
  const inputRef  = useRef(null);
  const mediaRef  = useRef(null);
  const chunksRef = useRef([]);

  const { data: moods = [] } = useQuery({
    queryKey: ["moods"],
    queryFn: () => base44.entities.Mood.list("-created_date", 10),
  });

  const { data: voiceEntries = [] } = useQuery({
    queryKey: ["voice-entries"],
    queryFn: () => base44.entities.VoiceEntry.list("-created_date", 5),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setVoiceTranscript("");
    setMessages(prev => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    const ctx = buildCoachContext(trimmed, moods, voiceEntries);
    setDetectedEmotion(ctx.emotion);
    setFeatureSuggestion(ctx.feature || null);

    const moodContext = moods.length > 0
      ? `User's recent mood log: ${moods.slice(0, 4).map(m => `${m.emotion} (intensity ${m.intensity}/5)`).join(", ")}.`
      : "No recent mood data.";

    const voiceContext = voiceEntries.length > 0
      ? `Voice journal patterns: recent entries show ${voiceEntries.slice(0, 2).map(e => e.detected_emotion || "unknown").join(", ")} emotions.`
      : "";

    const historyLines = messages.slice(-8).map(m =>
      `${m.role === "user" ? "User" : "Auradia"}: ${m.content}`
    ).join("\n");

    const prompt = `You are Auradia Coach — a warm, emotionally intelligent wellbeing companion. You are NOT a therapist or doctor. You are a safe, supportive presence.

PERSONALITY: Gentle, human, non-preachy. Use short paragraphs. Speak like a caring friend with wisdom — not a self-help book. Use emojis very sparingly (max 1-2 per response).

CONTEXT:
- Detected emotion: ${ctx.emotion} (${ctx.intensity} intensity)
- ${moodContext}
- ${voiceContext}
${ctx.hints.length > 0 ? `- Personalization note: ${ctx.hints.join(" ")}` : ""}

STRUCTURED RESPONSE GUIDE (use these as inspiration, not verbatim):
- Empathy: "${ctx.empathy}"
- Validation: "${ctx.validation}"
- Guidance: "${ctx.guidance}"
- Follow-up: "${ctx.followup}"

RULES:
- Never diagnose or give medical advice
- Always make suggestions optional, never commands
- If user seems very distressed, gently remind them professional support exists
- Keep response to 3-4 short paragraphs max
- End with ONE gentle question or suggestion, not both

CONVERSATION HISTORY:
${historyLines}
User: ${trimmed}

Respond as Auradia with warmth, depth, and genuine care:`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  const startVoiceRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      setVoiceTranscript("(Voice recorded — please type what you said above to continue)");
    };
    mr.start();
    mediaRef.current = mr;
    setIsRecording(true);
  };

  const stopVoiceRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  const currentBg = detectedEmotion || "default";

  return (
    <AnimatedBackground mood={currentBg}>
      <div className="max-w-lg mx-auto flex flex-col h-screen">

        {/* ── HEADER ── */}
        <div
          className="px-4 pt-6 pb-4 flex items-center gap-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(20px)" }}
        >
          <button onClick={() => navigate(createPageUrl("Home"))} className="text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <motion.div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg text-lg relative"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", boxShadow: "0 4px 16px rgba(168,85,247,0.4)" }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💜
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">Auradia Coach</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-emerald-600 font-medium">Here for you</p>
            </div>
          </div>

          {detectedEmotion && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="px-2.5 py-1 rounded-xl bg-white/60 border border-white/70 text-xs font-bold text-gray-600 capitalize shadow-sm">
              {detectedEmotion}
            </motion.div>
          )}
        </div>

        {/* ── MESSAGES ── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, type: "spring", stiffness: 300 }}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && AURADIA_AVATAR}
                <div className={`max-w-[84%] rounded-3xl px-4 py-3 ${
                  msg.role === "user"
                    ? "text-white rounded-br-lg shadow-lg"
                    : "bg-white/70 backdrop-blur-xl border border-white/70 text-gray-700 rounded-bl-lg shadow-sm"
                }`}
                  style={msg.role === "user" ? {
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    boxShadow: "0 4px 20px rgba(168,85,247,0.3)",
                  } : {}}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-p:my-1 leading-relaxed">
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing animation */}
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 items-end">
              {AURADIA_AVATAR}
              <div className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-3xl rounded-bl-lg px-5 py-3.5 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-purple-300"
                      animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.65, delay: i * 0.15, repeat: Infinity }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── FEATURE SUGGESTION CHIP ── */}
        <AnimatePresence>
          {featureSuggestion && messages.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="px-4 pb-2 flex-shrink-0"
            >
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(createPageUrl(featureSuggestion.page))}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/65 backdrop-blur-xl border border-white/75 shadow-md hover:bg-white/85 transition-all w-full"
                style={{ boxShadow: "0 4px 16px rgba(168,85,247,0.1)" }}
              >
                <span className="text-base">{featureSuggestion.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-gray-700">{featureSuggestion.label}</p>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── QUICK PROMPTS ── */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex-shrink-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Quick start</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PROMPTS.map(p => (
                <motion.button
                  key={p.text}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => sendMessage(p.text)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-2xl bg-gradient-to-br ${p.color} border ${p.border} text-xs text-gray-700 font-semibold shadow-sm`}
                >
                  {p.text}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ── INPUT BAR ── */}
        <div className="px-4 pb-6 pt-2 flex-shrink-0">
          {voiceTranscript && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[10px] text-purple-500 font-medium mb-1.5 px-1">
              {voiceTranscript}
            </motion.p>
          )}
          <div
            className="flex gap-2 rounded-2xl px-3 py-2 shadow-lg"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                isRecording ? "bg-rose-500 shadow-md" : "bg-purple-50 hover:bg-purple-100"
              }`}
            >
              {isRecording
                ? <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <MicOff className="w-4 h-4 text-white" />
                  </motion.div>
                : <Mic className="w-4 h-4 text-purple-500" />}
            </motion.button>

            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder={isRecording ? "Recording… tap again to stop" : "Share what's on your mind…"}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 flex-shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          <p className="text-center text-[10px] text-gray-300 mt-2">Not medical advice · Always here for you 💜</p>
        </div>
      </div>
    </AnimatedBackground>
  );
}