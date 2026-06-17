// Ripple Effects Engine — Structured Emotional Intelligence Dataset
// 100+ scenarios mapped by keywords

export const SCENARIOS = [
  // ── CONFRONTATION / HONESTY ──
  {
    keywords: ["confront", "honest", "truth", "tell them", "say it", "speak up", "call out"],
    context: "confrontation",
    positive: ["Builds long-term trust", "Clears misunderstanding", "Earns you self-respect", "Shows emotional courage"],
    negative: ["May cause short-term tension", "Could hurt their feelings", "Might create defensiveness"],
    score: { positive: 7, negative: 4 },
    recommendation: "proceed",
    advice: "Proceed gently — honesty, when delivered with empathy, deepens relationships.",
    followUp: "Are you calm enough to have this conversation right now?",
    relationshipImpact: "positive",
    emotionalImpact: "relief",
  },
  {
    keywords: ["confront aggressively", "yell", "shout", "lose my temper", "go off on"],
    context: "aggression",
    positive: ["Releases pent-up frustration temporarily"],
    negative: ["Damages trust significantly", "May say things you regret", "Creates lasting wounds", "Escalates conflict"],
    score: { positive: 2, negative: 9 },
    recommendation: "wait",
    advice: "Wait and breathe. Emotional flooding leads to words that can't be unsaid.",
    followUp: "What's the real need underneath this anger?",
    relationshipImpact: "negative",
    emotionalImpact: "regret",
  },

  // ── IGNORING / AVOIDANCE ──
  {
    keywords: ["ignore", "avoid", "ghost", "pretend", "act like nothing", "silent treatment"],
    context: "avoidance",
    positive: ["Buys time to cool down", "Avoids immediate conflict"],
    negative: ["Creates emotional distance", "Signals disrespect", "Unresolved tension grows", "They may feel dismissed"],
    score: { positive: 2, negative: 8 },
    recommendation: "think",
    advice: "Avoidance delays pain but compounds it. Consider a softer approach instead.",
    followUp: "What are you afraid would happen if you addressed it?",
    relationshipImpact: "negative",
    emotionalImpact: "guilt",
  },

  // ── CONFESSING FEELINGS ──
  {
    keywords: ["confess", "confess feelings", "tell them i like", "say i love", "express feelings", "admit i care"],
    context: "confession",
    positive: ["Emotional clarity and relief", "Opens door to deeper connection", "You honor your own feelings"],
    negative: ["Risk of rejection", "Might change dynamic", "Vulnerability feels scary"],
    score: { positive: 6, negative: 5 },
    recommendation: "proceed",
    advice: "Your feelings are valid. Expressing them is brave, whatever the outcome.",
    followUp: "How important is this relationship beyond romantic feelings?",
    relationshipImpact: "transformative",
    emotionalImpact: "relief",
  },

  // ── APOLOGY ──
  {
    keywords: ["apologize", "say sorry", "admit i was wrong", "take blame", "make amends"],
    context: "apology",
    positive: ["Restores trust quickly", "Shows emotional maturity", "Lifts guilt off your chest", "Models accountability"],
    negative: ["Vulnerability feels uncomfortable", "They may not accept it immediately"],
    score: { positive: 9, negative: 2 },
    recommendation: "proceed",
    advice: "A sincere apology is one of the most healing things you can offer.",
    followUp: "Is your apology coming from guilt or genuine empathy?",
    relationshipImpact: "very positive",
    emotionalImpact: "peace",
  },

  // ── SETTING BOUNDARIES ──
  {
    keywords: ["set boundary", "say no", "refuse", "decline", "not okay with", "limit", "stop them"],
    context: "boundary",
    positive: ["Protects your mental health", "Models self-respect", "Teaches others how to treat you", "Long-term respect"],
    negative: ["May cause temporary friction", "Could feel awkward initially"],
    score: { positive: 9, negative: 3 },
    recommendation: "proceed",
    advice: "Boundaries are an act of love — for yourself and for the relationship.",
    followUp: "Have you communicated this boundary before, or is this new?",
    relationshipImpact: "positive",
    emotionalImpact: "empowerment",
  },

  // ── ASKING FOR HELP ──
  {
    keywords: ["ask for help", "reach out", "tell someone", "ask support", "talk to someone"],
    context: "help_seeking",
    positive: ["Reduces burden immediately", "Strengthens connection", "Shows trust", "Gets practical support"],
    negative: ["Might feel vulnerable", "Fear of being judged"],
    score: { positive: 9, negative: 2 },
    recommendation: "proceed",
    advice: "Asking for help is strength, not weakness. People who care want to be there.",
    followUp: "Is there a specific person you trust most right now?",
    relationshipImpact: "positive",
    emotionalImpact: "relief",
  },

  // ── VENTING / RANTING ──
  {
    keywords: ["vent", "rant", "complain", "let it all out", "unload on"],
    context: "venting",
    positive: ["Immediate emotional release", "Feels heard if done with a listener"],
    negative: ["Can drain the listener", "May amplify negativity", "Doesn't solve the problem", "Could be oversharing"],
    score: { positive: 4, negative: 5 },
    recommendation: "think",
    advice: "A short vent can help, but prolonged rumination keeps you stuck. Aim for resolution after.",
    followUp: "After venting, what action would help you feel better?",
    relationshipImpact: "neutral",
    emotionalImpact: "mixed",
  },

  // ── WITHDRAW / ISOLATE ──
  {
    keywords: ["withdraw", "isolate", "stay alone", "hide", "shut everyone out", "disconnect"],
    context: "isolation",
    positive: ["Rest and recharge", "Sometimes necessary for introverts"],
    negative: ["Can deepen depression", "Misread as rejection by others", "Breaks connection loops", "Harder to re-emerge"],
    score: { positive: 3, negative: 7 },
    recommendation: "think",
    advice: "A short reset is healthy. Prolonged isolation often worsens emotional pain.",
    followUp: "Is this about rest, or are you avoiding something specific?",
    relationshipImpact: "negative",
    emotionalImpact: "loneliness",
  },

  // ── QUITTING / GIVING UP ──
  {
    keywords: ["quit", "give up", "stop trying", "leave", "walk away from", "drop it"],
    context: "quitting",
    positive: ["Protects energy for what matters", "Sometimes the right call", "Removes toxic situation"],
    negative: ["May regret not trying harder", "Could signal avoidance pattern", "Others depend on you"],
    score: { positive: 5, negative: 5 },
    recommendation: "think",
    advice: "Ask: am I quitting from fear, or from wisdom? Both exist — only you know which.",
    followUp: "Have you had a calm conversation about this, or only thought about it?",
    relationshipImpact: "varies",
    emotionalImpact: "ambivalence",
  },

  // ── IMPULSIVE MESSAGE ──
  {
    keywords: ["text them now", "message right now", "send it", "post it", "dm them", "reply now"],
    context: "impulse_message",
    positive: ["Feels cathartic in the moment"],
    negative: ["Words in heat rarely land well", "Hard to take back", "May escalate unnecessarily", "Could be misread"],
    score: { positive: 2, negative: 8 },
    recommendation: "wait",
    advice: "Write it — but wait 10 minutes before sending. Emotion changes; regret doesn't.",
    followUp: "Would you say this to their face right now?",
    relationshipImpact: "risky",
    emotionalImpact: "regret risk",
  },

  // ── FORGIVING ──
  {
    keywords: ["forgive", "let it go", "move on", "release anger", "stop holding grudge"],
    context: "forgiveness",
    positive: ["Frees you from carrying resentment", "Opens path to healing", "Inner peace", "May restore relationship"],
    negative: ["Doesn't mean forgetting", "Takes time — can't be forced"],
    score: { positive: 9, negative: 1 },
    recommendation: "proceed",
    advice: "Forgiveness is a gift you give yourself, not them. Take it at your own pace.",
    followUp: "Are you forgiving because you want to, or because you feel pressure to?",
    relationshipImpact: "healing",
    emotionalImpact: "peace",
  },

  // ── SHARING SOMETHING VULNERABLE ──
  {
    keywords: ["share something personal", "open up", "be vulnerable", "tell my story", "be honest about myself"],
    context: "vulnerability",
    positive: ["Deepens intimacy", "Others feel safe to open up too", "Authentic connection"],
    negative: ["Risk of being misunderstood", "Not everyone can hold your story"],
    score: { positive: 7, negative: 3 },
    recommendation: "proceed",
    advice: "Choose your audience wisely — vulnerability is powerful in the right hands.",
    followUp: "Do you trust this person with what you're about to share?",
    relationshipImpact: "positive",
    emotionalImpact: "connection",
  },

  // ── OVER-EXPLAINING ──
  {
    keywords: ["over-explain", "justify myself", "defend myself", "explain again", "keep explaining"],
    context: "over_explaining",
    positive: ["Ensures clarity"],
    negative: ["Can signal insecurity", "Exhausting for both parties", "Diminishes your stance", "Invites more pushback"],
    score: { positive: 2, negative: 6 },
    recommendation: "think",
    advice: "State your truth once, clearly. Repeating it often weakens rather than strengthens it.",
    followUp: "Do you feel safe enough to just say it once and let it land?",
    relationshipImpact: "neutral",
    emotionalImpact: "anxiety",
  },

  // ── TAKING SPACE ──
  {
    keywords: ["take space", "need space", "step back", "breathe", "pause", "time out"],
    context: "space",
    positive: ["Prevents escalation", "Allows emotional regulation", "Healthy reset"],
    negative: ["May be misread as abandonment", "Needs clear communication"],
    score: { positive: 8, negative: 3 },
    recommendation: "proceed",
    advice: "Space is healthy. Just communicate it — 'I need a moment, not a permanent exit.'",
    followUp: "Have you told them you need space, or just taken it silently?",
    relationshipImpact: "positive if communicated",
    emotionalImpact: "calm",
  },

  // ── JEALOUSY / COMPARISON ──
  {
    keywords: ["jealous", "envious", "compare myself", "they have more", "why not me", "unfair"],
    context: "jealousy",
    positive: ["Signals what you deeply want"],
    negative: ["Distances you from gratitude", "Creates resentment", "Affects self-worth", "Can drive harmful behavior"],
    score: { positive: 2, negative: 7 },
    recommendation: "think",
    advice: "Jealousy is a map to your desires — use it to redirect, not to compare.",
    followUp: "What is the jealousy telling you that you want for yourself?",
    relationshipImpact: "negative if expressed",
    emotionalImpact: "shame",
  },

  // ── STAYING SILENT ──
  {
    keywords: ["stay silent", "say nothing", "don't respond", "keep quiet", "bottle it up"],
    context: "silence",
    positive: ["Prevents impulsive damage", "Buys reflection time"],
    negative: ["Resentment accumulates", "Others can't read minds", "Situation stays unresolved"],
    score: { positive: 3, negative: 6 },
    recommendation: "think",
    advice: "Silence is wise short-term, but needs a follow-up conversation to truly resolve.",
    followUp: "When would be a good time to revisit this with more calm?",
    relationshipImpact: "neutral to negative",
    emotionalImpact: "frustration",
  },

  // ── OVER-APOLOGIZING ──
  {
    keywords: ["keep apologizing", "apologize again", "say sorry too much", "over-apologize"],
    context: "over_apology",
    positive: ["Shows remorse"],
    negative: ["Undermines your own confidence", "Can become manipulative", "Makes others uncomfortable", "Loses meaning"],
    score: { positive: 2, negative: 6 },
    recommendation: "think",
    advice: "Apologize once, sincerely, then show it through actions — not more words.",
    followUp: "Are you apologizing for what happened, or for existing?",
    relationshipImpact: "neutral",
    emotionalImpact: "low self-worth",
  },

  // ── MAKING A DECISION IMPULSIVELY ──
  {
    keywords: ["decide right now", "impulsive", "just do it", "act on impulse", "decide fast"],
    context: "impulsive_decision",
    positive: ["Breaks overthinking paralysis"],
    negative: ["Can lead to regret", "Misses important considerations", "Others may be affected"],
    score: { positive: 3, negative: 7 },
    recommendation: "wait",
    advice: "Sleep on it. Most important decisions improve with 24 hours of breathing room.",
    followUp: "If you wait one day, would you still make the same choice?",
    relationshipImpact: "risky",
    emotionalImpact: "uncertainty",
  },

  // ── ENDING A RELATIONSHIP ──
  {
    keywords: ["break up", "end it", "leave them", "stop seeing", "end the friendship", "cut ties"],
    context: "ending_relationship",
    positive: ["Frees you from toxicity", "Honors your needs", "Space for growth"],
    negative: ["Grief is real", "Shared history ends", "May trigger loneliness", "Others may be hurt"],
    score: { positive: 6, negative: 6 },
    recommendation: "think",
    advice: "Only you know if this relationship nourishes or depletes you. Trust that knowing.",
    followUp: "Have you expressed your needs clearly before making this decision?",
    relationshipImpact: "ending",
    emotionalImpact: "grief and freedom",
  },

  // ── REACHING OUT AFTER DISTANCE ──
  {
    keywords: ["reach out after long time", "reconnect", "message old friend", "check in on", "break the silence"],
    context: "reconnection",
    positive: ["Revives meaningful connection", "Shows you care", "Mutual joy possible", "Heals old distance"],
    negative: ["May be met with coldness", "Requires vulnerability"],
    score: { positive: 8, negative: 2 },
    recommendation: "proceed",
    advice: "A simple 'I've been thinking of you' carries more weight than you know.",
    followUp: "What made you think of them right now?",
    relationshipImpact: "positive",
    emotionalImpact: "warmth",
  },
];

// Fallback for unmatched inputs
export const DEFAULT_SCENARIO = {
  positive: ["Taking any action shows self-awareness", "Reflects on your values", "Builds emotional clarity"],
  negative: ["Outcome is uncertain", "May affect others involved"],
  score: { positive: 5, negative: 5 },
  recommendation: "think",
  advice: "Reflect on whether this action aligns with the person you want to be.",
  followUp: "How would your future self feel about this decision?",
  relationshipImpact: "unknown",
  emotionalImpact: "mixed",
};

export function matchScenario(input) {
  if (!input || input.trim().length < 3) return null;
  const lower = input.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const scenario of SCENARIOS) {
    const hits = scenario.keywords.filter(k => lower.includes(k)).length;
    if (hits > bestScore) {
      bestScore = hits;
      bestMatch = scenario;
    }
  }

  return bestMatch || DEFAULT_SCENARIO;
}

export const RELATIONSHIP_TYPES = [
  { id: "friend", label: "Friend", emoji: "👫" },
  { id: "partner", label: "Partner", emoji: "💑" },
  { id: "parent", label: "Parent", emoji: "👨‍👩‍👧" },
  { id: "colleague", label: "Colleague", emoji: "🤝" },
  { id: "teacher", label: "Teacher", emoji: "📚" },
  { id: "self", label: "Myself", emoji: "🪞" },
];

export const PERSONALITY_TYPES = [
  { id: "sensitive", label: "Sensitive", emoji: "🌸" },
  { id: "strict", label: "Strict", emoji: "⚖️" },
  { id: "supportive", label: "Supportive", emoji: "🤗" },
  { id: "unpredictable", label: "Unpredictable", emoji: "🌪️" },
  { id: "rational", label: "Rational", emoji: "🧠" },
  { id: "avoidant", label: "Avoidant", emoji: "🚪" },
];

export const CURRENT_EMOTIONS = [
  { id: "angry", label: "Angry", emoji: "😤", color: "#f87171" },
  { id: "sad", label: "Sad", emoji: "😢", color: "#818cf8" },
  { id: "anxious", label: "Anxious", emoji: "😟", color: "#c084fc" },
  { id: "excited", label: "Excited", emoji: "🤩", color: "#f472b6" },
  { id: "calm", label: "Calm", emoji: "😌", color: "#38bdf8" },
  { id: "hurt", label: "Hurt", emoji: "💔", color: "#fb7185" },
  { id: "hopeful", label: "Hopeful", emoji: "🌱", color: "#34d399" },
  { id: "confused", label: "Confused", emoji: "🌀", color: "#94a3b8" },
];