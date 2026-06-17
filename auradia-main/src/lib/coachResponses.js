// ─────────────────────────────────────────────
// Auradia Coach — Structured Response Engine
// ─────────────────────────────────────────────

// ── EMPATHY BANK ──────────────────────────────
const EMPATHY = {
  stressed: [
    "That sounds like a lot to carry right now.",
    "It makes complete sense you'd feel this way.",
    "You're dealing with something genuinely heavy.",
    "The pressure you're feeling is real and valid.",
    "I hear you — that's a lot to hold at once.",
    "Being stretched this thin is exhausting.",
    "Anyone would feel the weight of this.",
    "You don't have to minimize what you're going through.",
    "That kind of pressure doesn't just disappear overnight.",
    "Stress like this deserves to be acknowledged, not pushed away.",
  ],
  sad: [
    "I'm so sorry you're feeling this way.",
    "That sounds genuinely painful to sit with.",
    "It's okay to let yourself feel sad right now.",
    "Your heart is telling you something important.",
    "Sadness like this deserves space, not suppression.",
    "It takes courage to acknowledge when you're hurting.",
    "You don't have to be okay right now.",
    "I'm here with you in this moment.",
    "What you're feeling matters deeply.",
    "That heaviness is real — I see it.",
  ],
  angry: [
    "It sounds like something crossed a real boundary for you.",
    "That frustration is completely understandable.",
    "Your anger is pointing at something that matters to you.",
    "It's okay to feel fired up about this.",
    "Being this upset means you care deeply.",
    "That sounds genuinely unfair and infuriating.",
    "I wouldn't blame anyone for feeling this way.",
    "Anger can be a signal worth listening to.",
    "You have every right to feel what you're feeling.",
    "That reaction makes total sense given what happened.",
  ],
  anxious: [
    "That sense of unease is hard to shake off.",
    "Anxiety has a way of making everything feel urgent.",
    "I understand why your mind keeps going there.",
    "That restless feeling is real, even if it's hard to explain.",
    "Worrying about this shows how much it matters to you.",
    "Anxiety can be exhausting — you're not alone in this.",
    "Your nervous system is trying to protect you.",
    "It's okay to feel unsettled sometimes.",
    "That kind of tension is hard to sit with.",
    "You're not overreacting — this genuinely feels difficult.",
  ],
  lonely: [
    "Feeling disconnected is one of the hardest things to sit with.",
    "Loneliness can feel invisible to others, but it's so real.",
    "I see you, and I'm glad you're talking.",
    "That feeling of being unseen really hurts.",
    "You deserved to feel more connected than this.",
    "Being alone in your feelings is isolating in a deep way.",
    "Reaching out like this takes real courage.",
    "Even just naming this feeling is a brave step.",
    "You matter, even on days when it doesn't feel that way.",
    "Your presence here is enough.",
  ],
  happy: [
    "That's genuinely wonderful to hear!",
    "I love that energy — something good happened for you.",
    "It sounds like today has been kind to you.",
    "That lightness is worth celebrating.",
    "Joy like this deserves to be noticed.",
    "You seem to be in a really good space right now.",
    "That warmth in what you're sharing is beautiful.",
    "It's great to hear your heart feeling full.",
    "What a lovely thing to feel.",
    "This energy suits you.",
  ],
  calm: [
    "That sounds like a peaceful place to be.",
    "A sense of calm is something to really appreciate.",
    "It's lovely when things feel settled.",
    "That groundedness you have right now is valuable.",
    "Calm is its own kind of strength.",
    "It sounds like you've found some stillness today.",
    "There's something quietly powerful about feeling at ease.",
    "That sense of balance sounds really nourishing.",
    "I'm glad you're in this space right now.",
    "Peace like this is worth honoring.",
  ],
  excited: [
    "That excitement is contagious — I love it!",
    "Something has lit you up and it shows.",
    "That energy is wonderful to witness.",
    "Moments like this are worth savoring.",
    "You're radiating something good right now.",
    "That anticipation sounds really alive.",
    "It's beautiful when something makes you this animated.",
    "Your enthusiasm is genuinely uplifting.",
    "That spark is a gift.",
    "Something exciting is clearly unfolding for you.",
  ],
  overwhelmed: [
    "When everything hits at once, it's hard to know where to start.",
    "Feeling overwhelmed means you're taking on a lot — maybe too much.",
    "That sense of 'too much' is your signal to pause.",
    "It's okay to feel buried right now.",
    "Being pulled in too many directions is genuinely exhausting.",
    "You don't have to solve it all at once.",
    "That mental noise you're experiencing is real.",
    "Overwhelm is often a sign of someone who cares deeply.",
    "You're not failing — you're just full.",
    "This is a hard moment, not a permanent state.",
  ],
  confused: [
    "It's okay not to have clarity right now.",
    "Confusion is often the beginning of understanding.",
    "Not knowing how to feel is a feeling too.",
    "Your mind is working through something complex.",
    "It's okay to sit with uncertainty for a moment.",
    "Clarity usually follows after we let ourselves be confused.",
    "You don't need to figure it all out right now.",
    "This kind of fog lifts — it just takes time.",
    "Not everything has an immediate answer, and that's okay.",
    "You're allowed to not know.",
  ],
  motivated: [
    "That drive you're feeling is powerful.",
    "Something has activated a real sense of purpose in you.",
    "That momentum is worth directing well.",
    "There's real energy in what you're describing.",
    "You seem ready to move toward something meaningful.",
    "I love when you're in this mode.",
    "That kind of motivation is a spark — protect it.",
    "Something has clicked for you, and it shows.",
    "That clarity of purpose is a gift.",
    "You sound like you're ready to move.",
  ],
  neutral: [
    "I hear you — sometimes feelings are hard to pin down.",
    "It's okay to just be in a neutral space sometimes.",
    "Not every moment needs a label.",
    "I'm here to listen, whatever you're feeling.",
    "Sometimes 'okay' is actually a place of quiet strength.",
    "I'm with you, wherever you are right now.",
  ],
};

// ── VALIDATION BANK ───────────────────────────
const VALIDATION = [
  "What you're feeling is completely valid.",
  "Your emotions make total sense given what you're carrying.",
  "There's nothing wrong with you for feeling this way.",
  "Anyone in your position might feel exactly the same.",
  "Your feelings aren't an overreaction — they're information.",
  "You're allowed to feel exactly this.",
  "It's human to experience what you're going through.",
  "Your emotional response is proportionate and real.",
  "Feelings don't need to be justified to be valid.",
  "You don't need permission to feel what you feel.",
  "This is a natural response to a difficult situation.",
  "Your inner world is worth taking seriously.",
  "What you're experiencing is a normal part of being human.",
  "You're not being dramatic — this is genuinely hard.",
  "Your feelings exist for a reason, even if it's not clear yet.",
];

// ── GUIDANCE BANK (by emotion) ─────────────────
const GUIDANCE = {
  stressed: [
    "Sometimes the best thing is to take one small step, not ten big ones.",
    "Would it help to write down what's worrying you most right now?",
    "Breaking things into smaller pieces often makes them more manageable.",
    "Even a 5-minute pause can reset your nervous system.",
    "It might be worth naming the single biggest source of stress right now.",
    "Try not to solve everything at once — what's the one thing that matters most today?",
    "Sometimes saying 'I can't do everything' is an act of wisdom.",
    "Rest isn't a reward — it's part of the process.",
    "Talking to someone you trust, even briefly, can shift things.",
    "Your capacity has limits, and that's okay.",
  ],
  sad: [
    "Be gentle with yourself today — you don't have to be productive right now.",
    "Sometimes allowing yourself to cry is the most healing thing.",
    "Being around something comforting — even a warm drink — can help.",
    "Sadness often just needs to be felt, not fixed.",
    "Is there someone safe you can reach out to right now?",
    "Small acts of self-care can feel like anchors on hard days.",
    "You don't have to rush through this feeling.",
    "Journaling sometimes helps to untangle what's inside.",
    "Give yourself the grace you'd give a dear friend.",
    "It's okay to just rest and let yourself be sad.",
  ],
  angry: [
    "Physical movement — even a short walk — can help discharge that energy.",
    "Sometimes writing down exactly what angered you can bring relief.",
    "Breathing slowly before responding can prevent things from escalating.",
    "It's worth asking: what need of mine isn't being met right now?",
    "Anger is often grief or fear in disguise — worth exploring gently.",
    "Taking space before responding is always a valid option.",
    "Try not to make permanent decisions in a temporary emotional state.",
    "Naming the anger often takes away some of its power.",
    "You don't have to act on this feeling right away.",
    "What would you need to feel heard in this situation?",
  ],
  anxious: [
    "Slow, deep breathing can signal safety to your nervous system.",
    "Grounding yourself — noticing 5 things around you — can interrupt the spiral.",
    "Try gently questioning: is this a real threat, or a feared one?",
    "Sometimes anxiety shrinks when we write down what we're afraid of.",
    "Small, controllable actions can restore a sense of agency.",
    "You don't have to solve every 'what if' right now.",
    "Staying in the present moment, even briefly, can provide relief.",
    "Limiting news or social media might help reduce the noise.",
    "A short walk outside can do more than it seems.",
    "What's the one thing that would make you feel slightly safer right now?",
  ],
  lonely: [
    "Reaching out to even one person — even just a text — can help.",
    "Sometimes being in a public space, even quietly, can ease isolation.",
    "Journaling your thoughts can feel like a form of company.",
    "Is there a community — online or offline — where you might feel seen?",
    "Self-compassion is a real form of inner connection.",
    "Small acts of kindness toward others sometimes ease our own loneliness.",
    "You might be craving connection more than company — that's worth sitting with.",
    "A phone call, even a short one, can shift the feeling.",
    "Expressing yourself here is a real form of connection.",
    "You're less alone than you feel right now.",
  ],
  happy: [
    "Take a moment to really savor this feeling — it deserves attention.",
    "This might be a good time to reach out to someone you care about.",
    "Capturing this moment in a journal or a gratitude note could be meaningful.",
    "Happiness is worth reinforcing — what created it?",
    "Share this energy with someone who could use it.",
    "Celebrate this, even quietly.",
    "Notice what's working and let yourself appreciate it.",
    "This feeling is a resource — let it fill you up.",
    "What can you carry forward from today?",
    "Being in this space is worth being grateful for.",
  ],
  calm: [
    "This is a great moment to reflect on something meaningful.",
    "Calm states are wonderful for making thoughtful decisions.",
    "You might use this space to journal something you've been sitting with.",
    "Gratitude flows more easily from a calm place — this could be a good moment.",
    "Protecting this feeling matters — what nourishes it?",
    "Use this stillness to check in with what you really want.",
    "This is the kind of state worth returning to intentionally.",
    "Notice what created this calm — it's worth remembering.",
    "A moment of calm is a reset — let it work.",
    "Being here is enough.",
  ],
  excited: [
    "Channel this energy into something meaningful while it's alive.",
    "This is a great time to take that first step on something you've been delaying.",
    "Share this energy — it's contagious in the best way.",
    "Make sure to pace yourself so the excitement becomes sustainable.",
    "Write down what's exciting you — you'll want to remember this.",
    "Let yourself enjoy this fully before moving to the next thing.",
    "Is there a way to anchor this feeling so you can return to it?",
    "This energy is a gift — use it intentionally.",
    "Celebrate before you start planning.",
    "What's the most exciting part of what you're looking forward to?",
  ],
  overwhelmed: [
    "Start with just one thing — the smallest one.",
    "It's okay to say no to something today.",
    "Write everything down so it's outside your head.",
    "Ask for help — even a small amount of support can lighten the load.",
    "Take a breath before you do anything else.",
    "You don't have to solve everything today.",
    "Rest is not a luxury right now — it's essential.",
    "Delegate what you can, even imperfectly.",
    "Reducing inputs can help — step away from the noise for a moment.",
    "What's the one thing that matters most today? Start only there.",
  ],
  confused: [
    "Give yourself permission to not know yet.",
    "Sometimes writing out your thoughts helps untangle them.",
    "Talking to someone you trust might bring clarity.",
    "Step away and return later — fresh eyes often see more.",
    "Not every question needs to be answered today.",
    "What's the smallest piece of clarity you can find right now?",
    "Sometimes confusion is just the mind organizing itself.",
    "It's okay to sit in the question for a while.",
    "What do you know for certain, even if it's small?",
    "Clarity often comes after rest — your mind works even when you're not trying.",
  ],
  motivated: [
    "Use this energy now — start before the momentum fades.",
    "Break your goal into steps while you're in this headspace.",
    "Share your intention with someone — accountability helps.",
    "Celebrate this feeling as much as the outcome.",
    "What's the first concrete action you can take today?",
    "Protect this energy from distractions right now.",
    "This is a window — use it well.",
    "Write down what's driving you so you can return to it.",
    "Let this feeling fuel the next right step, not a thousand steps.",
    "What would make today feel like a win?",
  ],
  neutral: [
    "Sometimes checking in with yourself is enough.",
    "A gentle walk or change of scenery can invite more clarity.",
    "This might be a good time to do something quietly nourishing.",
    "Just being is valid — you don't always need to be 'on'.",
    "Is there something small you've been putting off that might feel good to do?",
  ],
};

// ── FOLLOW-UP PROMPTS ─────────────────────────
const FOLLOWUPS = {
  stressed: [
    "What's the one thing stressing you the most right now?",
    "Is this a new feeling or has it been building?",
    "Would it help to talk through what's on your plate?",
    "What would 'good enough' look like today?",
    "Is there anything you can let go of right now, even temporarily?",
  ],
  sad: [
    "Would you like to share what's behind this sadness?",
    "Has something specific happened, or is this more of a general heaviness?",
    "Is there something you need most right now — space, connection, or comfort?",
    "What would help you feel even a little less alone right now?",
    "Is there someone in your life you feel safe talking to?",
  ],
  angry: [
    "What happened that sparked this?",
    "Is this something that keeps coming up, or is it new?",
    "What would make you feel heard right now?",
    "What do you need from the person or situation that triggered this?",
    "Is there anything you want to say that you haven't been able to?",
  ],
  anxious: [
    "What's the worry that's loudest right now?",
    "Is this something you can take action on, or is it out of your control?",
    "Has anything helped with anxiety before?",
    "What would feeling safe look like for you in this moment?",
    "Would it help to talk through what's making you feel this way?",
  ],
  lonely: [
    "Is there someone specific you miss or wish you could connect with?",
    "What kind of connection feels most absent right now?",
    "Has anything shifted recently that made the loneliness stronger?",
    "Is there a community or space where you've felt more seen before?",
    "What would help you feel a little less alone tonight?",
  ],
  happy: [
    "What created this feeling for you?",
    "Is there someone you want to share this moment with?",
    "What do you want to carry forward from today?",
    "What's something you're looking forward to?",
    "What made today feel different?",
  ],
  calm: [
    "What helped you arrive at this place today?",
    "Is there something you'd like to reflect on while you're feeling this settled?",
    "What do you want to do with this calm?",
  ],
  excited: [
    "What are you most excited about right now?",
    "What's the first step you're planning to take?",
    "Who are you most excited to share this with?",
  ],
  overwhelmed: [
    "If you could only deal with one thing today, what would it be?",
    "What's taking up the most mental space right now?",
    "Is there anything on your plate that isn't actually yours to carry?",
  ],
  confused: [
    "What's the question you most wish you had an answer to?",
    "What do you know for certain, even if it's small?",
    "Is the confusion about a decision, a feeling, or something else?",
  ],
  motivated: [
    "What are you working toward right now?",
    "What does success look like to you in this area?",
    "What's the first step you can take today?",
  ],
  neutral: [
    "Is there anything specific on your mind today?",
    "What would make today feel meaningful?",
    "How have you been feeling overall lately?",
  ],
};

// ── FEATURE SUGGESTIONS ───────────────────────
export const FEATURE_SUGGESTIONS = {
  stressed:    { label: "Try a breathing exercise", page: "CalmZone",      emoji: "🌬️" },
  overwhelmed: { label: "Try the Calm Zone",        page: "CalmZone",      emoji: "🌬️" },
  anxious:     { label: "Try a breathing exercise", page: "CalmZone",      emoji: "🌬️" },
  sad:         { label: "Write in your journal",    page: "VoiceJournal",  emoji: "🎙️" },
  lonely:      { label: "Try anonymous sharing",    page: "AnonymousSharing", emoji: "🫂" },
  angry:       { label: "Explore Ripple Effects",   page: "RippleEngine",  emoji: "🌊" },
  happy:       { label: "Add to Gratitude Wall",    page: "GratitudeWall", emoji: "🌱" },
  motivated:   { label: "Set a Positive Ripple",    page: "PositiveRipple",emoji: "⚡" },
  calm:        { label: "Seal a Time Capsule",      page: "TimeCapsule",   emoji: "🔐" },
  excited:     { label: "Log a Positive Ripple",    page: "PositiveRipple",emoji: "⚡" },
  confused:    { label: "Explore Ripple Effects",   page: "RippleEngine",  emoji: "🌊" },
  neutral:     { label: "Check your Emotional Map", page: "EmotionalMap",  emoji: "🗺️" },
};

// ── PICK RANDOM ───────────────────────────────
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── SIMPLE KEYWORD EMOTION DETECTION ─────────
const EMOTION_KEYWORDS = {
  stressed:    ["stress", "pressure", "deadline", "overwhelmed", "busy", "too much", "can't keep up", "exhausted", "burnout"],
  sad:         ["sad", "cry", "crying", "depressed", "down", "grief", "hurt", "heartbroken", "miserable", "hopeless"],
  angry:       ["angry", "furious", "frustrated", "mad", "annoyed", "hate", "rage", "upset"],
  anxious:     ["anxious", "nervous", "worried", "fear", "scared", "panic", "dread", "uneasy"],
  lonely:      ["lonely", "alone", "isolated", "no one", "disconnected", "miss people", "abandoned"],
  happy:       ["happy", "great", "wonderful", "amazing", "joy", "glad", "excited", "good", "fantastic", "love"],
  calm:        ["calm", "peaceful", "relaxed", "settled", "balanced", "serene", "at ease"],
  excited:     ["excited", "thrilled", "pumped", "can't wait", "hyped", "energized", "motivated"],
  overwhelmed: ["overwhelmed", "drowning", "too much", "can't handle", "buried", "everything at once"],
  confused:    ["confused", "don't know", "unclear", "lost", "mixed up", "unsure", "no idea"],
  motivated:   ["motivated", "ready", "focused", "driven", "purpose", "determined", "goal"],
};

export function detectEmotionFromText(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    scores[emotion] = keywords.filter(k => lower.includes(k)).length;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] === 0) return "neutral";
  return best[0];
}

function detectIntensity(text) {
  const lower = text.toLowerCase();
  const highWords = ["extremely", "very", "so much", "deeply", "completely", "absolutely", "terrible", "horrible", "can't", "really"];
  const lowWords  = ["a bit", "slightly", "kind of", "sort of", "a little", "maybe", "somewhat"];
  if (highWords.some(w => lower.includes(w))) return "high";
  if (lowWords.some(w => lower.includes(w)))  return "low";
  return "medium";
}

// ── MAIN RESPONSE BUILDER ─────────────────────
export function buildCoachContext(userText, recentMoods = [], voiceEntries = []) {
  const emotion   = detectEmotionFromText(userText);
  const intensity = detectIntensity(userText);

  const empathy    = pick(EMPATHY[emotion]    || EMPATHY.neutral);
  const validation = pick(VALIDATION);
  const guidance   = pick(GUIDANCE[emotion]   || GUIDANCE.neutral);
  const followup   = pick(FOLLOWUPS[emotion]  || FOLLOWUPS.neutral);
  const feature    = FEATURE_SUGGESTIONS[emotion];

  // Personalization hints for the LLM
  const hints = [];
  if (recentMoods.length >= 3) {
    const stressCount = recentMoods.filter(m => ["stressed", "anxious"].includes(m.emotion)).length;
    if (stressCount >= 2) hints.push("User has been frequently stressed recently — gently suggest the Calm Zone.");
  }
  if (voiceEntries.length >= 2) {
    const dominantVoiceEmotion = voiceEntries[0]?.detected_emotion;
    if (dominantVoiceEmotion && dominantVoiceEmotion !== emotion) {
      hints.push(`User's voice entries often show ${dominantVoiceEmotion} — be aware of this emotional baseline.`);
    }
  }

  return {
    emotion,
    intensity,
    empathy,
    validation,
    guidance,
    followup,
    feature,
    hints,
    structuredPromptParts: { empathy, validation, guidance, followup },
  };
}