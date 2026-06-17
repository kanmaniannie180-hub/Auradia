import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Plus, X, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";

const EMOJIS = ["🌸", "☀️", "🌈", "💛", "🌿", "✨", "🎵", "🦋", "🍃", "💜", "🌻", "🙏", "❤️", "🌙", "⭐"];
const NOTE_COLORS = [
  { bg: "from-yellow-100/80 to-amber-50/60", border: "border-yellow-200/60", text: "text-amber-800", glow: "rgba(251,191,36,0.2)" },
  { bg: "from-pink-100/80 to-rose-50/60",   border: "border-pink-200/60",   text: "text-rose-800",  glow: "rgba(244,114,182,0.2)" },
  { bg: "from-green-100/80 to-emerald-50/60",border: "border-green-200/60", text: "text-emerald-800",glow: "rgba(52,211,153,0.2)" },
  { bg: "from-purple-100/80 to-violet-50/60",border: "border-purple-200/60",text: "text-violet-800", glow: "rgba(167,139,250,0.2)" },
  { bg: "from-blue-100/80 to-cyan-50/60",   border: "border-blue-200/60",  text: "text-sky-800",   glow: "rgba(56,189,248,0.2)" },
  { bg: "from-orange-100/80 to-amber-50/60",border: "border-orange-200/60", text: "text-orange-800", glow: "rgba(251,146,60,0.2)" },
];

export default function GratitudeWall() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditor, setShowEditor] = useState(false);
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("🌸");
  const [expanded, setExpanded] = useState(null);

  const { data: notes = [] } = useQuery({
    queryKey: ["gratitudes"],
    queryFn: () => base44.entities.GratitudeNote.list("-created_date", 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.GratitudeNote.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["gratitudes"] }); setText(""); setEmoji("🌸"); setShowEditor(false); },
  });

  return (
    <AnimatedBackground mood="grateful">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-32 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(createPageUrl("Home"))}
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-white text-xs font-bold shadow-lg relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", boxShadow: "0 4px 18px rgba(168,85,247,0.4)" }}
          >
            <motion.div className="absolute inset-0 bg-white/15"
              animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity }} />
            <Plus className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Add Gratitude</span>
          </motion.button>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <motion.span
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-2xl"
            >🌱</motion.span>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gratitude Wall</h1>
          </div>
          <p className="text-sm text-gray-400 pl-9">
            {notes.length > 0
              ? `${notes.length} beautiful moments you've collected`
              : "Little things that make life beautiful"}
          </p>
        </motion.div>

        {/* Stats strip */}
        {notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 mb-5"
          >
            {[
              { label: "Total", value: notes.length, emoji: "✨" },
              { label: "This week", value: notes.filter(n => moment(n.created_date).isAfter(moment().subtract(7, "days"))).length, emoji: "📅" },
              { label: "Streak", value: `${notes.filter(n => moment(n.created_date).isSame(moment(), "day")).length > 0 ? "🔥" : "—"}`, emoji: "🔥" },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex-1 bg-white/45 backdrop-blur-xl border border-white/60 rounded-2xl px-3 py-2.5 text-center shadow-sm"
              >
                <p className="text-base font-bold text-gray-800">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Editor */}
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-white/55 backdrop-blur-2xl border border-white/65 rounded-3xl p-5 shadow-xl"
                style={{ boxShadow: "0 8px 32px rgba(168,85,247,0.12), 0 0 0 1px rgba(255,255,255,0.6)" }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <p className="text-sm font-bold text-gray-700">What are you grateful for?</p>
                  </div>
                  <button onClick={() => setShowEditor(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>

                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Even the smallest things count…"
                  className="bg-white/50 border-white/60 rounded-2xl resize-none h-24 text-sm mb-4 focus:ring-1 focus:ring-purple-300 placeholder:text-gray-400"
                  autoFocus
                />

                {/* Emoji picker */}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Choose a feeling</p>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {EMOJIS.map(e => (
                    <motion.button key={e} whileTap={{ scale: 0.85 }} onClick={() => setEmoji(e)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all ${
                        emoji === e ? "bg-purple-100 scale-110 shadow-md border border-purple-200" : "bg-white/40 hover:bg-white/70"
                      }`}>
                      {e}
                    </motion.button>
                  ))}
                </div>

                {/* Preview */}
                {text.trim() && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/60">
                    <span className="text-xl mr-2">{emoji}</span>
                    <span className="text-sm text-emerald-800 font-medium">{text}</span>
                  </motion.div>
                )}

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => createMutation.mutate({ text, emoji })}
                  disabled={!text.trim() || createMutation.isPending}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                >
                  <Heart className="w-4 h-4" />
                  {createMutation.isPending ? "Saving…" : "Save to Gratitude Wall"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes grid */}
        {notes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 space-y-3">
            <motion.span
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl block"
            >🌱</motion.span>
            <p className="text-gray-700 font-bold text-lg">Start your gratitude journey</p>
            <p className="text-sm text-gray-400">Even one small thing counts</p>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowEditor(true)}
              className="mt-2 px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-md"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              Add first gratitude ✨
            </motion.button>
          </motion.div>
        ) : (
          <div className="columns-2 gap-3">
            {notes.map((note, i) => {
              const color = NOTE_COLORS[i % NOTE_COLORS.length];
              const isExpanded = expanded === note.id;
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 280 }}
                  whileHover={{ y: -4, boxShadow: `0 10px 28px ${color.glow}`, transition: { duration: 0.25 } }}
                  whileTap={{ scale: 0.97 }}
                  className="break-inside-avoid mb-3 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : note.id)}
                >
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${color.bg} backdrop-blur-xl border ${color.border} shadow-sm transition-shadow`}>
                    <motion.span
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                      className="text-2xl block mb-2"
                    >{note.emoji || "🌸"}</motion.span>
                    <p className={`text-sm ${color.text} font-medium leading-snug ${isExpanded ? "" : "line-clamp-3"}`}>
                      {note.text}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <p className="text-[10px] text-gray-400">{moment(note.created_date).format("MMM D")}</p>
                      {isExpanded && <span className="text-[10px] text-gray-400">✓ expanded</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}