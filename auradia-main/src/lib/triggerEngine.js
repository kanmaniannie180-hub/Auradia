// ─────────────────────────────────────────────────────
// Smart Trigger Engine — Auradia Emotional Pattern Detection
// ─────────────────────────────────────────────────────

const NEGATIVE_EMOTIONS = ["sad", "stressed", "angry", "anxious", "lonely", "overwhelmed"];
const POSITIVE_EMOTIONS = ["happy", "excited", "grateful", "calm"];

// Cooldown: don't re-show the same trigger type within this many ms
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

function getLastShown(key) {
  try { return parseInt(localStorage.getItem(`trigger_${key}`) || "0", 10); } catch { return 0; }
}
function markShown(key) {
  try { localStorage.setItem(`trigger_${key}`, Date.now().toString()); } catch {}
}
function isCooledDown(key) {
  return Date.now() - getLastShown(key) > COOLDOWN_MS;
}

// ─── TRIGGER 1: Negative streak (3+ negative moods in a row) ──────────────
function checkNegativeStreak(moods) {
  if (!moods || moods.length < 3) return null;
  if (!isCooledDown("negative_streak")) return null;

  const last = moods.slice(0, 5);
  const negCount = last.filter(m => NEGATIVE_EMOTIONS.includes(m.emotion)).length;
  if (negCount < 3) return null;

  const dominant = last
    .filter(m => NEGATIVE_EMOTIONS.includes(m.emotion))
    .reduce((acc, m) => { acc[m.emotion] = (acc[m.emotion] || 0) + 1; return acc; }, {});
  const topEmotion = Object.entries(dominant).sort((a, b) => b[1] - a[1])[0]?.[0] || "stressed";

  const messages = {
    stressed: {
      headline: "You've been carrying a lot lately",
      body: "Your last few check-ins have felt heavy. A short breathing session or a conversation might help ease the weight.",
    },
    sad: {
      headline: "We noticed you've been feeling low",
      body: "It's okay to have hard days. You don't have to go through this alone — a little support can make a difference.",
    },
    angry: {
      headline: "Tension has been building",
      body: "When frustration keeps showing up, it often helps to pause and process it gently.",
    },
    anxious: {
      headline: "Anxiety seems to be recurring",
      body: "Noticing a pattern of worry is the first step. A grounding exercise might help you find steadiness.",
    },
    lonely: {
      headline: "We see some loneliness in your recent entries",
      body: "You're not as alone as it might feel. Connecting — even anonymously — can lighten the load.",
    },
    overwhelmed: {
      headline: "Things seem to be piling up",
      body: "When everything feels like too much, even a 5-minute pause can shift your state.",
    },
  };

  return {
    id: "negative_streak",
    type: "support",
    emoji: "💜",
    color: { bg: "from-rose-50/90 to-pink-50/70", border: "border-rose-200/60", head: "text-rose-800", body: "text-rose-700", pill: "bg-rose-100/80" },
    ...(messages[topEmotion] || messages.stressed),
    actions: [
      { label: "Calm Zone", emoji: "🌬️", page: "CalmZone", style: "bg-sky-100 border-sky-200 text-sky-700" },
      { label: "Mood Coach", emoji: "💜", page: "AIMoodCoach", style: "bg-purple-100 border-purple-200 text-purple-700" },
      { label: "Emotional Map", emoji: "🗺️", page: "EmotionalMap", style: "bg-indigo-100 border-indigo-200 text-indigo-700" },
    ],
  };
}

// ─── TRIGGER 2: High intensity stress ─────────────────────────────────────
function checkHighIntensityStress(moods) {
  if (!moods || moods.length < 2) return null;
  if (!isCooledDown("high_intensity")) return null;

  const recentHigh = moods.slice(0, 4).filter(
    m => NEGATIVE_EMOTIONS.includes(m.emotion) && m.intensity >= 4
  );
  if (recentHigh.length < 2) return null;

  return {
    id: "high_intensity",
    type: "calm",
    emoji: "🌬️",
    color: { bg: "from-sky-50/90 to-cyan-50/70", border: "border-sky-200/60", head: "text-sky-800", body: "text-sky-700", pill: "bg-sky-100/80" },
    headline: "High intensity emotions detected",
    body: "Your emotions have been running intense recently. A guided breathing session can help bring your nervous system back to a gentler place.",
    actions: [
      { label: "Start Breathing", emoji: "🌬️", page: "CalmZone", style: "bg-sky-100 border-sky-200 text-sky-700" },
      { label: "Mood Coach", emoji: "💜", page: "AIMoodCoach", style: "bg-purple-100 border-purple-200 text-purple-700" },
    ],
  };
}

// ─── TRIGGER 3: Voice distress pattern ────────────────────────────────────
function checkVoiceDistress(voiceEntries) {
  if (!voiceEntries || voiceEntries.length < 2) return null;
  if (!isCooledDown("voice_distress")) return null;

  const recent = voiceEntries.slice(0, 3);
  const distressCount = recent.filter(
    e => NEGATIVE_EMOTIONS.includes(e.detected_emotion) && (e.intensity === "high" || e.intensity_score >= 4)
  ).length;
  if (distressCount < 2) return null;

  return {
    id: "voice_distress",
    type: "voice",
    emoji: "🎙️",
    color: { bg: "from-violet-50/90 to-purple-50/70", border: "border-violet-200/60", head: "text-violet-800", body: "text-violet-700", pill: "bg-violet-100/80" },
    headline: "Your voice reflects some tension",
    body: "We've heard stress or anxiety in your recent voice entries. Talking it through — even just to yourself — can be relieving.",
    actions: [
      { label: "Voice Journal", emoji: "🎙️", page: "VoiceJournal", style: "bg-violet-100 border-violet-200 text-violet-700" },
      { label: "Mood Coach", emoji: "💜", page: "AIMoodCoach", style: "bg-purple-100 border-purple-200 text-purple-700" },
    ],
  };
}

// ─── TRIGGER 4: Emotional fluctuation ────────────────────────────────────
function checkEmotionalFluctuation(moods) {
  if (!moods || moods.length < 4) return null;
  if (!isCooledDown("fluctuation")) return null;

  const last4 = moods.slice(0, 4);
  const positiveCount = last4.filter(m => POSITIVE_EMOTIONS.includes(m.emotion)).length;
  const negativeCount = last4.filter(m => NEGATIVE_EMOTIONS.includes(m.emotion)).length;

  // Only trigger if there's a real mix — not all one way
  if (positiveCount < 1 || negativeCount < 1) return null;
  if (Math.abs(positiveCount - negativeCount) > 2) return null; // too lopsided

  return {
    id: "fluctuation",
    type: "reflect",
    emoji: "🌊",
    color: { bg: "from-amber-50/90 to-yellow-50/70", border: "border-amber-200/60", head: "text-amber-800", body: "text-amber-700", pill: "bg-amber-100/80" },
    headline: "Your emotions have been shifting",
    body: "Ups and downs in quick succession can be exhausting. Taking a moment to reflect on what's driving the waves might bring some clarity.",
    actions: [
      { label: "Emotional Map", emoji: "🗺️", page: "EmotionalMap", style: "bg-indigo-100 border-indigo-200 text-indigo-700" },
      { label: "Ripple Engine", emoji: "🌊", page: "RippleEngine", style: "bg-amber-100 border-amber-200 text-amber-700" },
    ],
  };
}

// ─── TRIGGER 5: Positive moment ───────────────────────────────────────────
function checkPositiveMoment(moods) {
  if (!moods || moods.length < 1) return null;
  if (!isCooledDown("positive_moment")) return null;

  const latest = moods[0];
  if (!POSITIVE_EMOTIONS.includes(latest?.emotion)) return null;

  const prevWasNegative = moods[1] && NEGATIVE_EMOTIONS.includes(moods[1].emotion);

  return {
    id: "positive_moment",
    type: "celebrate",
    emoji: "🌱",
    color: { bg: "from-emerald-50/90 to-teal-50/70", border: "border-emerald-200/60", head: "text-emerald-800", body: "text-emerald-700", pill: "bg-emerald-100/80" },
    headline: prevWasNegative ? "What a beautiful shift 🌤️" : "This feeling is worth capturing",
    body: prevWasNegative
      ? "You were struggling, and now there's a lighter moment. That resilience deserves to be noticed."
      : "Good moments deserve to be remembered. Why not capture this in a gratitude note?",
    actions: [
      { label: "Gratitude Wall", emoji: "🌱", page: "GratitudeWall", style: "bg-emerald-100 border-emerald-200 text-emerald-700" },
      { label: "Time Capsule", emoji: "🔐", page: "TimeCapsule", style: "bg-violet-100 border-violet-200 text-violet-700" },
    ],
  };
}

// ─── TRIGGER 6: Long silence (no mood logged in 2+ days) ────────────────
function checkLongSilence(moods) {
  if (!moods || moods.length === 0) return null;
  if (!isCooledDown("long_silence")) return null;

  const lastEntry = new Date(moods[0].created_date);
  const hoursSince = (Date.now() - lastEntry.getTime()) / (1000 * 60 * 60);
  if (hoursSince < 48) return null;

  return {
    id: "long_silence",
    type: "gentle",
    emoji: "🌙",
    color: { bg: "from-indigo-50/90 to-violet-50/70", border: "border-indigo-200/60", head: "text-indigo-800", body: "text-indigo-700", pill: "bg-indigo-100/80" },
    headline: "We've missed you",
    body: "It's been a couple of days since your last check-in. A small moment of reflection can go a long way — no pressure, just whenever you're ready.",
    actions: [
      { label: "Log Mood", emoji: "🫧", page: "MoodBubbles", style: "bg-violet-100 border-violet-200 text-violet-700" },
      { label: "Voice Journal", emoji: "🎙️", page: "VoiceJournal", style: "bg-indigo-100 border-indigo-200 text-indigo-700" },
    ],
  };
}

// ─── MAIN: Run all triggers, return highest priority ──────────────────────
export function runTriggerEngine({ moods = [], voiceEntries = [] }) {
}

export function markTriggerSeen(triggerId) {
  markShown(triggerId);
}