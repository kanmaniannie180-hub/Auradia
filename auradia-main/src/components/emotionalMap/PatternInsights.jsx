import { motion } from "framer-motion";
import moment from "moment";

const EMOTION_COLORS_HEX = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

const EMOTION_EMOJIS = {
  happy: "😊", calm: "😌", neutral: "😐", sad: "😢", stressed: "😰",
  angry: "😤", anxious: "😟", tired: "😴", excited: "🤩", grateful: "🙏",
};

function getPatterns(moods) {
  const insights = [];
  if (moods.length < 5) return insights;

  const neg = ["stressed","anxious","angry","sad"];
  const pos = ["happy","excited","grateful","calm"];

  // Weekend vs weekday
  const weekendMoods = moods.filter(m => [0,6].includes(moment(m.created_date).day()));
  const weekdayMoods = moods.filter(m => ![0,6].includes(moment(m.created_date).day()));
  const wkdAvg = weekendMoods.length ? weekendMoods.filter(m => pos.includes(m.emotion)).length / weekendMoods.length : 0;
  const wkAvg = weekdayMoods.length ? weekdayMoods.filter(m => pos.includes(m.emotion)).length / weekdayMoods.length : 0;
  if (wkdAvg > wkAvg + 0.2) insights.push({ text: "You tend to feel happier on weekends 🌅", type: "positive" });
  if (wkAvg > wkdAvg + 0.2) insights.push({ text: "Weekdays bring more positive energy for you ⚡", type: "positive" });

  // Mid-week stress
  const midWeekStress = moods.filter(m => [2,3,4].includes(moment(m.created_date).day()) && neg.includes(m.emotion));
  if (midWeekStress.length >= 2) insights.push({ text: "Stress tends to peak mid-week for you 📅", type: "neutral" });

  // Recent trend
  const recent5 = moods.slice(0, 5);
  const recentPos = recent5.filter(m => pos.includes(m.emotion)).length;
  if (recentPos >= 4) insights.push({ text: "Your mood has been improving recently 📈", type: "positive" });
  else if (recentPos <= 1) insights.push({ text: "Your recent moods have been heavier — be kind to yourself 💜", type: "care" });

  // Intensity
  const avgInt = moods.reduce((s, m) => s + m.intensity, 0) / moods.length;
  if (avgInt > 3.8) insights.push({ text: "You feel emotions with high intensity — deeply sensitive 🌊", type: "neutral" });

  return insights.slice(0, 3);
}

// Mini dot heatmap — last 14 days
function MiniHeatmap({ moods }) {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = moment().subtract(i, "days").startOf("day");
    const dayMoods = moods.filter(m => moment(m.created_date).isSame(d, "day"));
    days.push({ label: i === 0 ? "T" : d.format("D"), moods: dayMoods });
  }

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">14-Day Mood Density</p>
      <div className="flex gap-1 justify-between">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex flex-col gap-0.5 items-center">
              {day.moods.length === 0 ? (
                <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200" />
              ) : day.moods.slice(0, 2).map((m, j) => (
                <div key={j} className="rounded-full border border-white/60"
                  style={{
                    width: 8 + m.intensity * 2,
                    height: 8 + m.intensity * 2,
                    background: EMOTION_COLORS_HEX[m.emotion],
                    opacity: 0.85,
                  }} />
              ))}
            </div>
            <p className="text-[8px] text-gray-400 font-medium">{day.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PatternInsights({ moods }) {
  if (!moods || moods.length === 0) return null;

  const emotionCounts = moods.reduce((a, m) => { a[m.emotion] = (a[m.emotion] || 0) + 1; return a; }, {});
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const avgIntensity = (moods.reduce((s, m) => s + m.intensity, 0) / moods.length).toFixed(1);
  const negCount = moods.filter(m => ["stressed","anxious","angry","sad"].includes(m.emotion)).length;
  const stability = Math.max(0, Math.round(100 - (negCount / moods.length) * 100));
  const patterns = getPatterns(moods);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="space-y-3">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Top Mood", value: topEmotion, display: `${EMOTION_EMOJIS[topEmotion]} ${topEmotion}` },
          { label: "Avg Intensity", value: avgIntensity, display: `${avgIntensity}/5` },
          { label: "Stability", value: stability, display: `${stability}%` },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm font-bold text-gray-800 capitalize">{s.display}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Mini heatmap */}
      <MiniHeatmap moods={moods} />

      {/* Pattern insights */}
      {patterns.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pattern Insights</p>
          {patterns.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl px-4 py-3 border ${
                p.type === "positive" ? "bg-emerald-50/70 border-emerald-200/60" :
                p.type === "care" ? "bg-violet-50/70 border-violet-200/60" :
                "bg-blue-50/70 border-blue-200/60"
              }`}>
              <p className="text-sm text-gray-700">{p.text}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}