import { motion } from "framer-motion";
import { RELATIONSHIP_TYPES, PERSONALITY_TYPES, CURRENT_EMOTIONS } from "@/lib/rippleScenarios";

export default function ContextInput({ context, onChange }) {
  const set = (key, val) => onChange({ ...context, [key]: context[key] === val ? null : val });

  return (
    <div className="space-y-4">
      {/* Who is this about */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Who is this about?</p>
        <div className="flex gap-2 flex-wrap">
          {RELATIONSHIP_TYPES.map(r => (
            <button key={r.id} onClick={() => set("relationship", r.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                context.relationship === r.id
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-white/50 border-white/60 text-gray-500"
              }`}>
              <span>{r.emoji}</span> {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* What kind of person */}
      {context.relationship && context.relationship !== "self" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">What kind of person are they?</p>
          <div className="flex gap-2 flex-wrap">
            {PERSONALITY_TYPES.map(p => (
              <button key={p.id} onClick={() => set("personality", p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  context.personality === p.id
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white/50 border-white/60 text-gray-500"
                }`}>
                <span>{p.emoji}</span> {p.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Current emotion */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">What are you feeling right now?</p>
        <div className="flex gap-2 flex-wrap">
          {CURRENT_EMOTIONS.map(e => (
            <button key={e.id} onClick={() => set("emotion", e.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={context.emotion === e.id ? {
                background: e.color + "22",
                borderColor: e.color + "66",
                color: e.color,
              } : {
                background: "rgba(255,255,255,0.5)",
                borderColor: "rgba(255,255,255,0.6)",
                color: "#6b7280",
              }}>
              <span>{e.emoji}</span> {e.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}