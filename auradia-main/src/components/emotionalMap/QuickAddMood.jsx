import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Mic, MicOff } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EMOTIONS = [
  { id: "happy", color: "#fbbf24", emoji: "😊" },
  { id: "calm", color: "#38bdf8", emoji: "😌" },
  { id: "sad", color: "#818cf8", emoji: "😢" },
  { id: "stressed", color: "#f87171", emoji: "😰" },
  { id: "excited", color: "#f472b6", emoji: "🤩" },
  { id: "grateful", color: "#34d399", emoji: "🙏" },
  { id: "anxious", color: "#c084fc", emoji: "😟" },
  { id: "tired", color: "#7dd3fc", emoji: "😴" },
  { id: "neutral", color: "#94a3b8", emoji: "😐" },
  { id: "angry", color: "#fb923c", emoji: "😤" },
];

function getDayPeriod() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

export default function QuickAddMood() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Mood.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods-all"] });
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      setDone(true);
      setTimeout(() => {
        setOpen(false); setSelected(null); setIntensity(3);
        setReason(""); setDone(false); setAudioUrl(null);
      }, 1200);
    },
  });

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach(t => t.stop());
    };
    mr.start();
    mediaRef.current = mr;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  const selectedColor = EMOTIONS.find(e => e.id === selected)?.color;

  return (
    <>
      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-28 right-4 z-50 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center"
        style={{ width: 52, height: 52, boxShadow: "0 4px 20px rgba(168,85,247,0.45)" }}
      >
        <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
      </motion.button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setOpen(false)} />

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-2xl rounded-t-3xl shadow-2xl border-t border-white/60 px-5 pt-5 pb-10 max-w-lg mx-auto"
            >
              {done ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center py-8 gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="font-bold text-gray-700">Added to your map ✨</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-base font-bold text-gray-800">Add Emotion</p>
                      <p className="text-xs text-gray-400">How are you feeling right now?</p>
                    </div>
                    <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Emotion grid */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {EMOTIONS.map(em => (
                      <button key={em.id} onClick={() => setSelected(em.id === selected ? null : em.id)}
                        className="flex flex-col items-center gap-1">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                          style={{
                            background: selected === em.id ? `radial-gradient(circle at 35% 35%, ${em.color}ff, ${em.color}88)` : `${em.color}22`,
                            boxShadow: selected === em.id ? `0 0 14px ${em.color}55` : "none",
                            border: selected === em.id ? `2px solid ${em.color}66` : "2px solid transparent",
                          }}>
                          <span className="text-lg">{em.emoji}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 capitalize font-medium">{em.id}</span>
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <>
                      {/* Intensity */}
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Intensity</p>
                        <div className="flex gap-1.5">
                          {[1,2,3,4,5].map(l => (
                            <button key={l} onClick={() => setIntensity(l)}
                              className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                              style={{
                                background: intensity === l ? selectedColor + "22" : "rgba(255,255,255,0.3)",
                                borderColor: intensity === l ? selectedColor + "88" : "rgba(255,255,255,0.5)",
                                color: intensity === l ? selectedColor : "#9ca3af",
                              }}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Why do you feel this way?</p>
                        <input
                          value={reason}
                          onChange={e => setReason(e.target.value)}
                          placeholder="e.g. Had a great meeting, exam stress..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300 placeholder:text-gray-400"
                        />
                      </div>

                      {/* Voice recording */}
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Voice memory (optional)</p>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                              isRecording
                                ? "bg-red-500 text-white border-red-400"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            {isRecording ? (
                              <>
                                <motion.div className="w-2 h-2 rounded-full bg-white"
                                  animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                                <MicOff className="w-3.5 h-3.5" /> Stop
                              </>
                            ) : (
                              <><Mic className="w-3.5 h-3.5" /> Record</>
                            )}
                          </motion.button>
                          {audioUrl && (
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 rounded-xl border border-purple-100">
                              <span className="text-xs">🎙️</span>
                              <span className="text-[10px] text-purple-600 font-semibold">Voice saved</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => mutation.mutate({ emotion: selected, intensity, note: reason || undefined, day_period: getDayPeriod() })}
                        disabled={mutation.isPending}
                        className="w-full py-3.5 rounded-2xl text-white text-sm font-bold shadow-md"
                        style={{ background: `linear-gradient(135deg, ${selectedColor}ee, ${selectedColor}99)` }}
                      >
                        {mutation.isPending ? "Adding..." : "Add to Emotional Map"}
                      </button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}