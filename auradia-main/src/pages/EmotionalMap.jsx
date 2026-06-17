import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";
import TimelineNode from "@/components/emotionalMap/TimelineNode";
import ConnectorLine from "@/components/emotionalMap/ConnectorLine";
import NodeDetailPanel from "@/components/emotionalMap/NodeDetailPanel";
import PatternInsights from "@/components/emotionalMap/PatternInsights";
import QuickAddMood from "@/components/emotionalMap/QuickAddMood";

const EMOTION_COLORS_HEX = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

const EMOTION_EMOJIS = {
  happy: "😊", calm: "😌", neutral: "😐", sad: "😢", stressed: "😰",
  angry: "😤", anxious: "😟", tired: "😴", excited: "🤩", grateful: "🙏",
};

const FILTER_RANGES = [
  { label: "Week", days: 7 },
  { label: "Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "All", days: 9999 },
];

// Normalize TimeCapsule opened entry → mood-like shape
function capsuleToEntry(c) {
  const emotion = c.emotion_tags?.[0] || "neutral";
  return {
    id: `tc-${c.id}`,
    emotion,
    intensity: 3,
    note: c.message ? `Time Capsule: ${c.message.slice(0, 60)}` : "Time Capsule opened",
    created_date: c.opened_at || c.created_date,
    day_period: null,
    _source: "timeCapsule",
  };
}

export default function EmotionalMap() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [emotionFilter, setEmotionFilter] = useState(null);
  const [rangeFilter, setRangeFilter] = useState(30);
  const [activeTab, setActiveTab] = useState("timeline"); // "timeline" | "insights"

  const { data: moods = [], isLoading: loadingMoods } = useQuery({
    queryKey: ["moods-all"],
    queryFn: () => base44.entities.Mood.list("-created_date", 100),
  });

  const { data: capsules = [] } = useQuery({
    queryKey: ["capsules"],
    queryFn: () => base44.entities.TimeCapsule.list("-created_date", 50),
  });

  // Merge all sources into unified timeline entries
  const allEntries = useMemo(() => {
    const moodEntries = moods.map(m => ({ ...m, _source: "mood" }));
    const openedCapsules = capsules
      .filter(c => c.status === "opened" && c.opened_at)
      .map(capsuleToEntry);
    return [...moodEntries, ...openedCapsules]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [moods, capsules]);

  const isLoading = loadingMoods;

  // Apply filters
  const cutoff = moment().subtract(rangeFilter, "days").startOf("day");
  const filtered = allEntries
    .filter(m => rangeFilter === 9999 || moment(m.created_date).isSameOrAfter(cutoff))
    .filter(m => !emotionFilter || m.emotion === emotionFilter);

  // Group by day
  const grouped = filtered.reduce((acc, mood) => {
    const day = moment(mood.created_date).format("YYYY-MM-DD");
    if (!acc[day]) acc[day] = [];
    acc[day].push(mood);
    return acc;
  }, {});
  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleNodeClick = (mood) => {
    setSelectedMood(prev => prev?.id === mood.id ? null : mood);
  };

  return (
    <AnimatedBackground>
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">

        {/* ── HEADER ── */}
        <div className="px-4 pt-6 pb-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(createPageUrl("Home"))}
              className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-1.5 bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-1">
              {["timeline", "insights"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all capitalize ${
                    activeTab === tab
                      ? "bg-white/80 text-purple-600 shadow-sm"
                      : "text-gray-400"
                  }`}>
                  {tab === "timeline" ? "🗺 Timeline" : "💡 Insights"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-2xl"
            >🗺️</motion.span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Emotional Map</h1>
              <p className="text-sm text-gray-400 mt-0.5">Your living emotional history</p>
            </div>
          </div>
        </div>

        {/* ── RANGE FILTERS ── */}
        <div className="px-4 mb-3">
          <div className="flex gap-1.5 bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-1.5">
            {FILTER_RANGES.map(({ label, days: d }) => (
              <button key={label} onClick={() => setRangeFilter(d)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  rangeFilter === d
                    ? "bg-white/80 text-purple-600 shadow-sm"
                    : "text-gray-400"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── EMOTION FILTER CHIPS ── */}
        <div className="px-4 mb-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {emotionFilter && (
              <button onClick={() => setEmotionFilter(null)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/50 border border-white/60 text-xs text-gray-600 font-medium">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
            {Object.keys(EMOTION_EMOJIS).map(e => (
              <button key={e} onClick={() => setEmotionFilter(e === emotionFilter ? null : e)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border"
                style={emotionFilter === e ? {
                  background: EMOTION_COLORS_HEX[e] + "22",
                  borderColor: EMOTION_COLORS_HEX[e] + "66",
                  color: EMOTION_COLORS_HEX[e],
                } : {
                  background: "rgba(255,255,255,0.3)",
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "#9ca3af",
                }}>
                <span>{EMOTION_EMOJIS[e]}</span> {e}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 px-4 pb-36 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ════════════════════ TIMELINE TAB ════════════════════ */}
            {activeTab === "timeline" && (
              <motion.div key="timeline" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                {isLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                  </div>
                ) : days.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
                      className="text-5xl mb-4 block">🗺️</motion.div>
                    <p className="text-gray-600 font-medium">No emotional data yet</p>
                    <p className="text-sm text-gray-400 mt-1">Tap + to log your first emotion</p>
                  </motion.div>
                ) : (
                  <div className="space-y-0">
                    {days.map((day, di) => {
                      const entries = grouped[day];
                      const isToday = moment(day).isSame(moment(), "day");
                      const isYesterday = moment(day).isSame(moment().subtract(1, "day"), "day");
                      const dayLabel = isToday ? "Today" : isYesterday ? "Yesterday" : moment(day).format("MMMM D");
                      const weekday = moment(day).format("dddd");
                      const dominantEmotion = Object.entries(
                        entries.reduce((acc, m) => { acc[m.emotion] = (acc[m.emotion] || 0) + 1; return acc; }, {})
                      ).sort((a, b) => b[1] - a[1])[0][0];
                      const domColor = EMOTION_COLORS_HEX[dominantEmotion] || "#a78bfa";

                      return (
                        <motion.div key={day}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: di * 0.07 }}
                          className="mb-5"
                        >
                          {/* Day header */}
                          <div className="flex items-center gap-3 mb-3">
                            {/* Day dot */}
                            <div className="relative flex-shrink-0">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: domColor + "22", border: `1.5px solid ${domColor}55` }}>
                                <span className="text-base">{EMOTION_EMOJIS[dominantEmotion]}</span>
                              </div>
                              {isToday && (
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-800">{dayLabel}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] text-gray-400">{isToday || isYesterday ? weekday : moment(day).format("ddd")}</p>
                                <span className="text-[10px] text-gray-300">·</span>
                                <p className="text-[10px] text-gray-400">{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Horizontal bubble strip with connecting lines */}
                          <div className="ml-4 pl-8 border-l-2 pb-2"
                            style={{ borderColor: domColor + "44" }}>
                            <div className="flex items-center flex-wrap gap-0">
                              {entries.map((mood, mi) => (
                                <React.Fragment key={mood.id}>
                                  <TimelineNode
                                    mood={mood}
                                    index={di * 10 + mi}
                                    isSelected={selectedMood?.id === mood.id}
                                    onClick={handleNodeClick}
                                  />
                                  {mi < entries.length - 1 && (
                                    <ConnectorLine
                                      fromEmotion={mood.emotion}
                                      toEmotion={entries[mi + 1].emotion}
                                      index={di * 10 + mi}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            {/* Inline detail panel for selected mood in this day */}
                            <AnimatePresence>
                              {entries.map(mood => selectedMood?.id === mood.id && (
                                <NodeDetailPanel
                                  key={`panel-${mood.id}`}
                                  mood={mood}
                                  onClose={() => setSelectedMood(null)}
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ════════════════════ INSIGHTS TAB ════════════════════ */}
            {activeTab === "insights" && (
              <motion.div key="insights" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                {moods.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                    <span className="text-5xl block mb-4">📊</span>
                    <p className="text-gray-600 font-medium">Log moods to unlock insights</p>
                    <p className="text-sm text-gray-400 mt-1">Your emotional patterns will appear here</p>
                  </motion.div>
                ) : (
                  <PatternInsights moods={moods} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Add FAB */}
        <QuickAddMood />
      </div>
    </AnimatedBackground>
  );
}