import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { X, ChevronRight } from "lucide-react";
import { runTriggerEngine, markTriggerSeen } from "@/lib/triggerEngine";

export default function SmartTrigger({ moods = [], voiceEntries = [] }) {
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Slight delay so it doesn't compete with page load
    const t = setTimeout(() => {
      const result = runTriggerEngine({ moods, voiceEntries });
      setTrigger(result);
      setDismissed(false);
    }, 800);
    return () => clearTimeout(t);
  }, [moods.length, voiceEntries.length]);

  const handleDismiss = () => {
    if (trigger) markTriggerSeen(trigger.id);
    setDismissed(true);
  };

  const handleAction = (page) => {
    if (trigger) markTriggerSeen(trigger.id);
    navigate(createPageUrl(page));
  };

  if (!trigger || dismissed) return null;

  const { color, emoji, headline, body, actions } = trigger;

  return (
    <AnimatePresence>
      <motion.div
        key={trigger.id}
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`rounded-3xl overflow-hidden border ${color.border}`}
        style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.6)" }}
      >
        <div className={`bg-gradient-to-br ${color.bg} backdrop-blur-xl p-4`}>

          {/* Header */}
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`w-9 h-9 rounded-2xl ${color.pill} flex items-center justify-center text-lg flex-shrink-0`}
              >
                {emoji}
              </motion.div>
              <div>
                <p className={`text-sm font-bold ${color.head} leading-tight`}>{headline}</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className={`${color.body} opacity-50 hover:opacity-90 transition-opacity p-0.5 flex-shrink-0`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <p className={`text-xs ${color.body} leading-relaxed mb-3.5 opacity-90`}>{body}</p>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {actions.map((action, i) => (
              <motion.button
                key={action.page}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleAction(action.page)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all ${action.style} ${i === 0 ? "flex-1" : ""}`}
              >
                <span>{action.emoji}</span>
                <span>{action.label}</span>
                {i === 0 && <ChevronRight className="w-3 h-3 ml-auto" />}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}