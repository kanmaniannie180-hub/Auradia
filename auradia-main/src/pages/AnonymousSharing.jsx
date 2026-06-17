import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Plus, X, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";

const EMOTION_TAGS = ["stress", "sad", "hope", "gratitude", "anxiety", "healing", "lonely", "growth", "overwhelmed", "proud"];
const TAG_COLORS = {
  stress: "bg-rose-100 text-rose-700 border-rose-200",
  sad: "bg-indigo-100 text-indigo-700 border-indigo-200",
  hope: "bg-amber-100 text-amber-700 border-amber-200",
  gratitude: "bg-teal-100 text-teal-700 border-teal-200",
  anxiety: "bg-violet-100 text-violet-700 border-violet-200",
  healing: "bg-emerald-100 text-emerald-700 border-emerald-200",
  lonely: "bg-slate-100 text-slate-700 border-slate-200",
  growth: "bg-green-100 text-green-700 border-green-200",
  overwhelmed: "bg-red-100 text-red-700 border-red-200",
  proud: "bg-orange-100 text-orange-700 border-orange-200",
};

const REACTIONS = [
  { key: "relate", emoji: "🤍", label: "Relate" },
  { key: "strong", emoji: "🌿", label: "Strong" },
  { key: "care", emoji: "✨", label: "Care" },
  { key: "matter", emoji: "🫶", label: "Matter" },
  { key: "with_you", emoji: "🌙", label: "With you" },
];

export default function AnonymousSharing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showComposer, setShowComposer] = useState(false);
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [filter, setFilter] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const { data: posts = [] } = useQuery({
    queryKey: ["anon-posts"],
    queryFn: () => base44.entities.AnonymousPost.list("-created_date", 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AnonymousPost.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["anon-posts"] }); setText(""); setTag(""); setShowComposer(false); },
  });

  const reactMutation = useMutation({
    mutationFn: ({ id, post, reactionKey }) => {
      const reactions = { ...(post.reactions || {}) };
      reactions[reactionKey] = (reactions[reactionKey] || 0) + 1;
      return base44.entities.AnonymousPost.update(id, { reactions });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["anon-posts"] }),
  });

  const filtered = filter ? posts.filter(p => p.emotion_tag === filter) : posts;

  return (
    <AnimatedBackground>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-32 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(createPageUrl("Home"))} className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowComposer(!showComposer)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Share
          </motion.button>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Community</h1>
          </div>
          <p className="text-sm text-gray-400">You are not alone here 💜 · {posts.length} voices</p>
        </div>

        {/* Composer */}
        <AnimatePresence>
          {showComposer && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
              <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl p-5 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-gray-700">Share anonymously</p>
                  <button onClick={() => setShowComposer(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
                <Textarea value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="Share what you're carrying... no name attached."
                  className="bg-white/40 border-white/50 rounded-2xl resize-none h-24 text-sm mb-4 focus:ring-1 focus:ring-purple-300" />
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tag your feeling</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {EMOTION_TAGS.map(t => (
                    <button key={t} onClick={() => setTag(t)}
                      className={`px-3 py-1 rounded-full text-xs capitalize transition-all border font-medium ${
                        tag === t ? `${TAG_COLORS[t]}` : "bg-white/20 border-white/30 text-gray-500"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => createMutation.mutate({ text, emotion_tag: tag })}
                  disabled={!text.trim() || !tag || createMutation.isPending}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold disabled:opacity-40 shadow-md"
                >
                  {createMutation.isPending ? "Sharing..." : "Post Anonymously 🌙"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none">
          {filter && (
            <button onClick={() => setFilter(null)} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/50 border border-white/60 text-xs text-gray-600 font-medium">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          {EMOTION_TAGS.map(t => (
            <button key={t} onClick={() => setFilter(t === filter ? null : t)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs capitalize transition-all border font-medium ${
                filter === t ? TAG_COLORS[t] : "bg-white/30 border-white/40 text-gray-500"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Feed */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <span className="text-5xl block mb-4">🫂</span>
            <p className="text-gray-600 font-medium">Be the first to share</p>
            <p className="text-sm text-gray-400 mt-1">Your voice matters here</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div
                  onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                  className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full capitalize font-semibold border ${TAG_COLORS[post.emotion_tag]}`}>
                      {post.emotion_tag}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-auto">{moment(post.created_date).fromNow()}</span>
                  </div>
                  <p className={`text-sm text-gray-700 leading-relaxed ${expanded === post.id ? "" : "line-clamp-3"}`}>{post.text}</p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {REACTIONS.map(r => {
                      const count = post.reactions?.[r.key] || 0;
                      return (
                        <button key={r.key}
                          onClick={(e) => { e.stopPropagation(); reactMutation.mutate({ id: post.id, post, reactionKey: r.key }); }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/50 border border-white/60 text-xs hover:bg-white/80 transition-all font-medium">
                          <span>{r.emoji}</span>
                          {count > 0 && <span className="text-gray-500">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}