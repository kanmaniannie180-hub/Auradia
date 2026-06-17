import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, ImageIcon, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

const EMOTIONS = [
  { id: "happy", emoji: "😊", color: "#fbbf24" },
  { id: "calm", emoji: "😌", color: "#38bdf8" },
  { id: "sad", emoji: "😢", color: "#818cf8" },
  { id: "stressed", emoji: "😰", color: "#f87171" },
  { id: "excited", emoji: "🤩", color: "#f472b6" },
  { id: "grateful", emoji: "🙏", color: "#34d399" },
  { id: "anxious", emoji: "😟", color: "#c084fc" },
  { id: "neutral", emoji: "😐", color: "#94a3b8" },
];

const TAGS = ["growth", "gratitude", "stress", "milestone", "hope", "healing", "letting_go", "reflection"];

const DATE_PRESETS = [
  { label: "1 Week", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
];

function getPresetDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// Validate that selected date is strictly in the future (end-of-day)
function isValidFutureDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return d.getTime() > Date.now();
}

export default function CapsuleCreator({ onClose, onSealed }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [tags, setTags] = useState([]);
  const [unlockDate, setUnlockDate] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [sealing, setSealing] = useState(false);

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const imageInputRef = useRef(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TimeCapsule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["capsules"] });
      setSealing(false);
      onSealed?.();
    },
  });

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - imageUrls.length);
    if (!files.length) return;
    setUploadingImage(true);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrls(prev => [...prev, file_url]);
    }
    setUploadingImage(false);
  };

  const handleSeal = async () => {
    if (!message.trim() || !unlockDate) return;
    if (!isValidFutureDate(unlockDate)) return;
    setSealing(true);

    let voiceUrl = null;
    if (audioBlob) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioBlob });
      voiceUrl = file_url;
    }

    createMutation.mutate({
      title: title.trim() || undefined,
      message,
      mood: selectedEmotion || undefined,
      emotion_tags: tags.length > 0 ? tags : undefined,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      voice_url: voiceUrl || undefined,
      unlock_date: unlockDate,
      status: "locked",
    });
  };

  const emotionColor = EMOTIONS.find(e => e.id === selectedEmotion)?.color;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md border border-white/70 shadow-2xl max-h-[92vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Vault seal animation overlay */}
        <AnimatePresence>
          {sealing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 rounded-3xl bg-indigo-900/85 backdrop-blur-md flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl"
              >🔐</motion.div>
              <p className="text-white font-bold text-lg">Sealing your memory…</p>
              <p className="text-white/60 text-xs">Locked until {unlockDate}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-base font-bold text-gray-800">Seal a Memory</p>
              <p className="text-xs text-gray-400">A message for your future self</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Title (optional)</p>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Before my first day, Summer 2025…"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 placeholder:text-gray-400"
            />
          </div>

          {/* Message */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Write to your future self</p>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Dear future me… What do you want to remember about this moment?"
              className="bg-white/60 border-gray-200 rounded-2xl resize-none h-28 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-300"
            />
          </div>

          {/* Emotion picker */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Current feeling</p>
            <div className="flex gap-2 flex-wrap">
              {EMOTIONS.map(em => (
                <button key={em.id} onClick={() => setSelectedEmotion(em.id === selectedEmotion ? null : em.id)}
                  className="flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: selectedEmotion === em.id ? `${em.color}33` : "rgba(243,244,246,0.8)",
                      border: selectedEmotion === em.id ? `2px solid ${em.color}88` : "2px solid transparent",
                      boxShadow: selectedEmotion === em.id ? `0 0 12px ${em.color}44` : "none",
                    }}>
                    <span className="text-lg">{em.emoji}</span>
                  </div>
                  <span className="text-[8px] text-gray-400 capitalize">{em.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tag this memory</p>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map(tag => (
                <button key={tag} onClick={() => setTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                  className={`px-3 py-1 rounded-full text-xs capitalize font-medium border transition-all ${
                    tags.includes(tag)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}>
                  {tag.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Add images (optional)</p>
            <div className="flex gap-2 flex-wrap">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} className="w-16 h-16 rounded-xl object-cover border border-white/60 shadow-sm" />
                  <button onClick={() => setImageUrls(p => p.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {imageUrls.length < 3 && (
                <button onClick={() => imageInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:border-indigo-300 hover:text-indigo-400 transition-colors">
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-[9px]">Add</span>
                    </>
                  )}
                </button>
              )}
              <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          {/* Voice recording */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Voice memory (optional)</p>
            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                  isRecording
                    ? "bg-red-500 text-white border-red-400 shadow-lg"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {isRecording ? (
                  <>
                    <motion.div className="w-2 h-2 rounded-full bg-white"
                      animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                    <MicOff className="w-3.5 h-3.5" /> Stop
                  </>
                ) : (
                  <><Mic className="w-3.5 h-3.5" /> Record</>
                )}
              </motion.button>

              {audioUrl && (
                <div className="flex items-center gap-2 bg-purple-50 rounded-2xl px-3 py-1.5 border border-purple-100 flex-1">
                  <span className="text-sm">🎙️</span>
                  <audio src={audioUrl} controls className="flex-1" style={{ height: 28 }} />
                </div>
              )}
            </div>
          </div>

          {/* Unlock date */}
          <div className="mb-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Unlock on</p>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {DATE_PRESETS.map(p => (
                <button key={p.days} onClick={() => setUnlockDate(getPresetDate(p.days))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    unlockDate === getPresetDate(p.days)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
            <input type="date" value={unlockDate} onChange={e => setUnlockDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 text-gray-700" />
          </div>

          {/* Seal button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSeal}
            disabled={!message.trim() || !unlockDate || !isValidFutureDate(unlockDate) || createMutation.isPending}
            className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-lg disabled:opacity-40 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}
          >
            <motion.div className="absolute inset-0 bg-white/10"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
            🔒 Seal Memory
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}