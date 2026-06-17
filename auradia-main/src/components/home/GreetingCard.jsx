import { motion } from "framer-motion";

function getGreeting(hour) {
  if (hour < 12) return { text: "Good morning", tone: "uplifting", emoji: "🌤️" };
  if (hour < 17) return { text: "Good afternoon", tone: "warm", emoji: "☀️" };
  if (hour < 21) return { text: "Good evening", tone: "calm", emoji: "🌅" };
  return { text: "Good night", tone: "soothing", emoji: "🌙" };
}

function getMoodMessage(lastMood, tone) {
  if (!lastMood) return "How are you feeling today?";
  const neg = ["sad", "stressed", "angry", "anxious", "tired"];
  if (neg.includes(lastMood.emotion)) return "I'm here for you. Take it easy 💜";
  if (tone === "soothing") return "Time to rest and recharge 🌙";
  if (tone === "uplifting") return "Ready for a beautiful day? ✨";
  return "You're doing wonderful 🌿";
}

export default function GreetingCard({ userName, lastMood }) {
  const hour = new Date().getHours();
  const { text, tone, emoji } = getGreeting(hour);
  const message = getMoodMessage(lastMood, tone);
  const firstName = userName ? userName.split(" ")[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="pt-2 pb-1"
    >
      <div className="flex items-start justify-between">
        <div>
          {/* Emoji + name fade in together */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="flex items-center gap-2 mb-1"
          >
            <span className="text-2xl">{emoji}</span>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {text}{firstName ? `, ${firstName}` : ""}
            </h1>
          </motion.div>

          {/* Sub-message fades in slightly after */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-sm text-gray-500 pl-10 leading-relaxed"
          >
            {message}
          </motion.p>
        </div>

        {/* Heart orb — slow breathe + slow sway */}
        <motion.div
          animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.05, 1], y: [0, -4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-lg border border-white/60 shadow-sm flex-shrink-0"
        >
          🫀
        </motion.div>
      </div>
    </motion.div>
  );
}