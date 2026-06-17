import { motion } from "framer-motion";
import { CheckCircle, Clock, RefreshCw } from "lucide-react";

const RECOMMENDATION_CONFIG = {
  proceed: {
    label: "Proceed",
    sublabel: "This looks like a healthy direction",
    icon: CheckCircle,
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    iconColor: "text-emerald-500",
    dot: "bg-emerald-400",
  },
  think: {
    label: "Think Again",
    sublabel: "A little reflection could help",
    icon: RefreshCw,
    bg: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    text: "text-amber-700",
    iconColor: "text-amber-500",
    dot: "bg-amber-400",
  },
  wait: {
    label: "Wait & Reflect",
    sublabel: "Give it some time before acting",
    icon: Clock,
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-200",
    text: "text-violet-700",
    iconColor: "text-violet-500",
    dot: "bg-violet-400",
  },
};

export default function RecommendationCard({ recommendation, advice, followUp }) {
  const cfg = RECOMMENDATION_CONFIG[recommendation] || RECOMMENDATION_CONFIG.think;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`rounded-3xl bg-gradient-to-br ${cfg.bg} border ${cfg.border} p-4`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm`}>
          <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
            <p className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</p>
          </div>
          <p className={`text-[10px] ${cfg.text} opacity-70`}>{cfg.sublabel}</p>
        </div>
      </div>

      <p className={`text-xs ${cfg.text} leading-relaxed bg-white/40 rounded-2xl px-3 py-2 mb-3`}>
        "{advice}"
      </p>

      {followUp && (
        <div className="bg-white/50 rounded-xl px-3 py-2">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Reflect on this</p>
          <p className="text-xs text-gray-600 italic">"{followUp}"</p>
        </div>
      )}
    </motion.div>
  );
}