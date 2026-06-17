import { motion } from "framer-motion";
import moment from "moment";

const EMOTION_SOLID = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

const EMOTION_EMOJIS = {
  happy: "😊", calm: "😌", neutral: "😐", sad: "😢", stressed: "😰",
  angry: "😤", anxious: "😟", tired: "😴", excited: "🤩", grateful: "🙏",
};

function getPattern(moods) {
  if (moods.length < 3) return null;
  const neg = ["stressed", "anxious", "angry", "sad"];
  const pos = ["happy", "excited", "grateful", "calm"];
  const negCount = moods.slice(0, 5).filter(m => neg.includes(m.emotion)).length;
  const posCount = moods.slice(0, 5).filter(m => pos.includes(m.emotion)).length;
  const avgIntensity = moods.reduce((s, m) => s + m.intensity, 0) / moods.length;

  if (negCount >= 3) return "Your recent moods have been heavy. Be gentle with yourself today. 💜";
  if (posCount >= 3) return "You've been in a positive flow lately. Keep nurturing that energy. ✨";
  if (avgIntensity >= 4) return "You're feeling things deeply right now — that's a sign of aliveness. 🌊";
  return "Your emotions have been mixed lately — that's very human and okay. 🌿";
}

function getTodaySummary(moods) {
  const today = moment().startOf("day");
  const todayMoods = moods.filter(m => moment(m.created_date).isSameOrAfter(today));
  if (todayMoods.length === 0) return null;
  const counts = {};
  todayMoods.forEach(m => { counts[m.emotion] = (counts[m.emotion] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (top.length === 1) return `Today you felt mostly ${top[0][0]}.`;
  return `Today you felt mostly ${top[0][0]} with moments of ${top[1]?.[0] || ""}.`;
}

// Last 7 days timeline
function getLast7Days(moods) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = moment().subtract(i, "days").startOf("day");
    const dayMoods = moods.filter(m => moment(m.created_date).isSame(d, "day"));
    days.push({ label: i === 0 ? "Today" : d.format("ddd"), moods: dayMoods });
  }
  return days;
}

export default function MoodInsights({ moods }) {
  if (!moods || moods.length === 0) return null;

  const todaySummary = getTodaySummary(moods);
  const pattern = getPattern(moods);
  const last7 = getLast7Days(moods);

  const emotionCounts = moods.reduce((a, m) => { a[m.emotion] = (a[m.emotion] || 0) + 1; return a; }, {});
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const avgIntensity = (moods.reduce((s, m) => s + m.intensity, 0) / moods.length).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-3"
    >
      {/* Today summary */}
      {todaySummary && (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-3.5">
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Today</p>
          <p className="text-sm text-gray-700 font-medium">{todaySummary}</p>
        </div>
      )}

      {/* 7-day timeline */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Last 7 Days</p>
        <p className="text-xs text-purple-400 font-medium mb-3">Your recent emotional flow</p>
        <div className="relative flex justify-between items-end gap-1">
          {/* Connecting line behind bubbles */}
          <svg className="absolute inset-0 w-full" style={{ height: 60, top: 0, pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="flow-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {last7.map((day, i) => {
              if (i === 0 || !day.moods[0] || !last7[i-1]?.moods[0]) return null;
              const xStep = 100 / 6;
              const x1 = `${(i - 1) * xStep + xStep / 2}%`;
              const x2 = `${i * xStep + xStep / 2}%`;
              const y = 30;
              return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="url(#flow-line)" strokeWidth="1.5" strokeDasharray="4 3" />;
            })}
          </svg>

          {last7.map((day, i) => {
            const topMood = day.moods.sort((a, b) => b.intensity - a.intensity)[0];
            const color = topMood ? (EMOTION_SOLID[topMood.emotion] || "#a78bfa") : null;
            const bubbleSize = topMood ? 18 + topMood.intensity * 5 : 14;
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-1.5 flex-1 relative z-10"
                title={topMood ? `${topMood.emotion} (${topMood.intensity}/5)` : "No mood"}
              >
                {day.moods.length === 0 ? (
                  <div className="rounded-full bg-gray-100 border border-gray-200" style={{ width: 14, height: 14 }} />
                ) : (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.07, type: "spring", stiffness: 300 }}
                    className="rounded-full border-2 border-white shadow-md"
                    style={{
                      width: bubbleSize,
                      height: bubbleSize,
                      background: `radial-gradient(circle at 35% 30%, ${color}ff, ${color}99)`,
                      boxShadow: `0 4px 12px ${color}44`,
                    }}
                    whileHover={{ scale: 1.3 }}
                  />
                )}
                <p className="text-[9px] text-gray-400 font-medium">{day.label}</p>
                {topMood && (
                  <p className="text-[8px] capitalize" style={{ color: color + "bb" }}>
                    {EMOTION_EMOJIS[topMood.emotion]}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Top Mood</p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: EMOTION_SOLID[topEmotion] + "33" }}>
              <span className="text-sm">{EMOTION_EMOJIS[topEmotion]}</span>
            </div>
            <p className="text-sm font-bold text-gray-700 capitalize">{topEmotion}</p>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Intensity</p>
          <div className="flex items-center gap-1.5">
            <p className="text-lg font-bold text-gray-800">{avgIntensity}</p>
            <p className="text-xs text-gray-400">/ 5</p>
          </div>
        </div>
      </div>

      {/* Pattern insight */}
      {pattern && (
        <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/60 border border-purple-100/60 rounded-2xl px-4 py-3.5">
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Pattern Insight</p>
          <p className="text-sm text-gray-700 leading-relaxed">{pattern}</p>
        </div>
      )}
    </motion.div>
  );
}