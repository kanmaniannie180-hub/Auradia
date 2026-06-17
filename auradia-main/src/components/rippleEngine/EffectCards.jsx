import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function EffectCards({ positive, negative }) {
  return (
    <div className="space-y-3">
      {/* Positive effects */}
      <div>
        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Positive ripples
        </p>
        <div className="space-y-2">
          {positive.map((effect, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="flex items-start gap-2.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl px-3.5 py-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Plus className="w-3 h-3 text-emerald-700" />
              </div>
              <p className="text-xs text-emerald-800 font-medium leading-snug">{effect}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Negative effects */}
      <div>
        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Minus className="w-3 h-3" /> Possible challenges
        </p>
        <div className="space-y-2">
          {negative.map((effect, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="flex items-start gap-2.5 bg-rose-50/70 border border-rose-100 rounded-2xl px-3.5 py-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Minus className="w-3 h-3 text-rose-600" />
              </div>
              <p className="text-xs text-rose-700 font-medium leading-snug">{effect}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}