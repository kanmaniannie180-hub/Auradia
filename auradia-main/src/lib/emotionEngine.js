// Emotion Detection Engine — keyword/phrase based analysis
// Maps transcript text → emotion + intensity

const EMOTION_LEXICON = {
  happy: {
    high:   ["so happy", "ecstatic", "overjoyed", "amazing", "incredible", "fantastic", "best day", "wonderful", "thrilled", "elated"],
    medium: ["happy", "glad", "pleased", "good day", "enjoyed", "cheerful", "smile", "grateful", "thankful", "blessed"],
    low:    ["okay", "fine", "alright", "not bad", "decent", "manageable", "content"],
  },
  calm: {
    high:   ["very peaceful", "completely relaxed", "deeply calm", "serene", "at peace", "tranquil", "centered"],
    medium: ["calm", "relaxed", "settled", "balanced", "comfortable", "easy", "steady"],
    low:    ["a bit calm", "sort of okay", "not too stressed", "mild"],
  },
  sad: {
    high:   ["devastated", "heartbroken", "crying", "deeply sad", "miserable", "depressed", "hopeless", "broken", "lost", "grief"],
    medium: ["sad", "down", "unhappy", "upset", "disappointed", "hurt", "low", "blue", "missing", "lonely"],
    low:    ["a little sad", "slightly down", "not great", "meh", "off today"],
  },
  stressed: {
    high:   ["extremely stressed", "overwhelmed", "too much", "can't handle", "breaking down", "burnout", "exhausted", "falling apart"],
    medium: ["stressed", "pressure", "deadline", "workload", "too busy", "struggling", "tense", "strained"],
    low:    ["a bit stressed", "slightly pressured", "minor stress", "small worry"],
  },
  angry: {
    high:   ["furious", "enraged", "so angry", "hate this", "can't stand", "boiling", "explode", "livid", "outraged"],
    medium: ["angry", "annoyed", "frustrated", "irritated", "mad", "upset with", "bothered", "fed up"],
    low:    ["a bit annoyed", "slightly frustrated", "mildly irritated", "not happy about"],
  },
  excited: {
    high:   ["super excited", "can't wait", "pumped up", "hyped", "thrilled", "bursting with", "electric", "charged"],
    medium: ["excited", "looking forward", "enthusiastic", "energized", "eager", "motivated", "inspired"],
    low:    ["a little excited", "somewhat interested", "curious about", "might be good"],
  },
  anxious: {
    high:   ["panic", "terrified", "extremely anxious", "can't breathe", "dread", "spiraling", "worst case", "freaking out"],
    medium: ["anxious", "nervous", "worried", "fear", "scared", "uneasy", "restless", "on edge", "dreading"],
    low:    ["a bit nervous", "slightly worried", "small anxiety", "mild fear", "unsure"],
  },
  lonely: {
    high:   ["completely alone", "nobody cares", "isolated", "abandoned", "no one", "invisible", "empty", "disconnected"],
    medium: ["lonely", "alone", "miss people", "no one to talk", "left out", "excluded", "distant"],
    low:    ["a bit lonely", "could use company", "feeling disconnected", "missing someone"],
  },
  confident: {
    high:   ["absolutely sure", "totally confident", "unstoppable", "powerful", "strong", "certain", "ready for anything"],
    medium: ["confident", "capable", "ready", "prepared", "self-assured", "believe in myself", "can do this"],
    low:    ["somewhat confident", "trying to be sure", "getting there", "a bit more sure"],
  },
};

// Score weights
const INTENSITY_SCORE = { low: 2, medium: 3, high: 5 };
const INTENSITY_NUMERIC = { low: 1, medium: 3, high: 5 };

export function detectEmotion(text) {
  if (!text || text.trim().length < 3) {
    return { emotion: "neutral", intensity: "medium", intensityScore: 3, confidence: 0 };
  }

  const lower = text.toLowerCase();
  const scores = {};

  for (const [emotion, levels] of Object.entries(EMOTION_LEXICON)) {
    let score = 0;
    for (const [level, keywords] of Object.entries(levels)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          score += INTENSITY_SCORE[level];
        }
      }
    }
    if (score > 0) scores[emotion] = score;
  }

  if (Object.keys(scores).length === 0) {
    return { emotion: "neutral", intensity: "medium", intensityScore: 3, confidence: 0 };
  }

  // Dominant emotion
  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const emotion = dominant[0];
  const rawScore = dominant[1];

  // Determine intensity
  let intensity = "low";
  const highMatches = EMOTION_LEXICON[emotion].high.filter(k => lower.includes(k)).length;
  const medMatches = EMOTION_LEXICON[emotion].medium.filter(k => lower.includes(k)).length;
  if (highMatches > 0) intensity = "high";
  else if (medMatches > 0) intensity = "medium";

  const intensityScore = INTENSITY_NUMERIC[intensity];
  const confidence = Math.min(rawScore / 10, 1);

  return { emotion, intensity, intensityScore, confidence };
}

// Emotion display config
export const EMOTION_CONFIG = {
  happy:      { emoji: "😊", color: "#fbbf24", bg: "from-yellow-50 to-amber-50",   border: "border-yellow-200", text: "text-amber-700",  label: "Happy"      },
  calm:       { emoji: "😌", color: "#38bdf8", bg: "from-sky-50 to-cyan-50",        border: "border-sky-200",    text: "text-sky-700",    label: "Calm"       },
  sad:        { emoji: "😢", color: "#818cf8", bg: "from-indigo-50 to-violet-50",   border: "border-indigo-200", text: "text-indigo-700", label: "Sad"        },
  stressed:   { emoji: "😰", color: "#f87171", bg: "from-rose-50 to-red-50",        border: "border-rose-200",   text: "text-rose-700",   label: "Stressed"   },
  angry:      { emoji: "😤", color: "#fb923c", bg: "from-orange-50 to-amber-50",    border: "border-orange-200", text: "text-orange-700", label: "Angry"      },
  excited:    { emoji: "🤩", color: "#f472b6", bg: "from-pink-50 to-fuchsia-50",    border: "border-pink-200",   text: "text-pink-700",   label: "Excited"    },
  anxious:    { emoji: "😟", color: "#c084fc", bg: "from-violet-50 to-purple-50",   border: "border-violet-200", text: "text-violet-700", label: "Anxious"    },
  lonely:     { emoji: "🫂", color: "#94a3b8", bg: "from-slate-50 to-gray-50",      border: "border-slate-200",  text: "text-slate-600",  label: "Lonely"     },
  confident:  { emoji: "💪", color: "#34d399", bg: "from-emerald-50 to-teal-50",    border: "border-emerald-200",text: "text-emerald-700",label: "Confident"  },
  neutral:    { emoji: "😐", color: "#94a3b8", bg: "from-gray-50 to-slate-50",      border: "border-gray-200",   text: "text-gray-600",   label: "Neutral"    },
};

export const INTENSITY_LABELS = {
  low: "Mild",
  medium: "Moderate",
  high: "Strong",
};

// Pattern analysis across entries
export function analyzePatterns(entries) {
  if (!entries || entries.length < 2) return null;

  const withEmotion = entries.filter(e => e.detected_emotion);
  if (withEmotion.length < 2) return null;

  // Dominant emotion
  const emotionCounts = {};
  withEmotion.forEach(e => {
    emotionCounts[e.detected_emotion] = (emotionCounts[e.detected_emotion] || 0) + 1;
  });
  const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

  // Stability score: lower variance = more stable
  const scores = withEmotion.map(e => e.intensity_score || 3);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
  const stabilityScore = Math.max(0, Math.round(10 - variance * 2));

  // Recent trend (last 3 vs older)
  const recent = withEmotion.slice(0, 3).map(e => e.intensity_score || 3);
  const older  = withEmotion.slice(3, 6).map(e => e.intensity_score || 3);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / (recent.length || 1);
  const olderAvg  = older.reduce((a, b) => a + b, 0) / (older.length || 1);
  const trend = recentAvg > olderAvg + 0.5 ? "rising" : recentAvg < olderAvg - 0.5 ? "falling" : "stable";

  return {
    dominantEmotion: dominant[0],
    dominantCount: dominant[1],
    total: withEmotion.length,
    stabilityScore,
    trend,
    emotionCounts,
    mean: Math.round(mean * 10) / 10,
  };
}