import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Clock, ExternalLink, Play, Square } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const EMOTION_COLORS_HEX = {
  happy: "#fbbf24", calm: "#38bdf8", neutral: "#94a3b8",
  sad: "#818cf8", stressed: "#f87171", angry: "#fb923c",
  anxious: "#c084fc", tired: "#7dd3fc", excited: "#f472b6", grateful: "#34d399",
};

const EMOTION_EMOJIS = {
  happy: "😊", calm: "😌", neutral: "😐", sad: "😢", stressed: "😰",
  angry: "😤", anxious: "😟", tired: "😴", excited: "🤩", grateful: "🙏",
};

const INTENSITY_LABELS = ["", "Barely", "Mildly", "Quite", "Very", "Deeply"];

const SOURCE_LABELS = {
  mood: { label: "Mood Log", icon: "🫧", page: "MoodBubbles" },
  timeCapsule: { label: "Time Capsule", icon: "🔐", page: "TimeCapsule" },
  voiceJournal: { label: "Voice Journal", icon: "🎙️", page: "VoiceJournal" },
};

export default function NodeDetailPanel({ mood, onClose }) {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(mood._audioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const color = EMOTION_COLORS_HEX[mood.emotion] || "#a78bfa";
  const source = mood._source || "mood";
  const sourceInfo = SOURCE_LABELS[source];

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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="mx-0 mt-3 mb-1 bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl overflow-hidden shadow-xl"
      style={{ boxShadow: `0 8px 32px ${color}22` }}
    >
      {/* Color header strip */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${color}cc, ${color}44)` }} />

      <div className="p-4">
        {/* Top row: mood + close */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}>
              <span className="text-2xl">{EMOTION_EMOJIS[mood.emotion]}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 capitalize">{mood.emotion}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full"
                      style={{ background: i <= mood.intensity ? color : "#e5e7eb" }} />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{INTENSITY_LABELS[mood.intensity]}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 mb-3">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-xs text-gray-400">
            {moment(mood.created_date).format("MMMM D, YYYY · h:mm A")}
            {mood.day_period && <span className="ml-1 capitalize">· {mood.day_period}</span>}
          </p>
        </div>

        {/* Reason/note */}
        {mood.note ? (
          <div className="bg-gray-50/80 rounded-2xl p-3 mb-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Why I felt this</p>
            <p className="text-sm text-gray-700 leading-relaxed italic">"{mood.note}"</p>
          </div>
        ) : (
          <div className="bg-gray-50/40 rounded-2xl p-2.5 mb-3 border border-dashed border-gray-200">
            <p className="text-xs text-gray-400 italic text-center">No reason recorded</p>
          </div>
        )}

        {/* Voice memory section */}
        <div className="mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Voice Memory</p>

          {audioUrl ? (
            <div className="flex items-center gap-2 bg-purple-50/60 rounded-2xl px-3 py-2.5 border border-purple-100">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: color }}
              >
                {isPlaying
                  ? <Square className="w-3.5 h-3.5 text-white" fill="white" />
                  : <Play className="w-3.5 h-3.5 text-white" fill="white" />
                }
              </motion.button>
              {/* Animated waveform bars */}
              <div className="flex gap-0.5 items-center flex-1">
                {[...Array(16)].map((_, i) => (
                  <motion.div key={i}
                    className="rounded-full"
                    style={{ width: 2, background: color + "aa" }}
                    animate={isPlaying ? {
                      height: [4, 4 + Math.sin(i * 0.8) * 10, 4],
                    } : { height: 4 }}
                    transition={isPlaying ? { duration: 0.8, repeat: Infinity, delay: i * 0.04 } : {}}
                  />
                ))}
              </div>
              <p className="text-[10px] text-purple-500 font-semibold flex-shrink-0">🎙️ Recorded</p>
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
            </div>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isRecording
                    ? "bg-red-500 text-white border-red-400"
                    : "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
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
              <button onClick={() => navigate(createPageUrl("VoiceJournal"))}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200 hover:border-purple-200 transition-all">
                <ExternalLink className="w-3 h-3" /> Open Journal
              </button>
            </div>
          )}
        </div>

        {/* Source origin link */}
        {sourceInfo && (
          <button
            onClick={() => navigate(createPageUrl(sourceInfo.page))}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
          >
            <span className="text-base">{sourceInfo.icon}</span>
            <div className="text-left flex-1">
              <p className="text-[10px] font-semibold text-gray-500">From {sourceInfo.label}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </button>
        )}
      </div>
    </motion.div>
  );
}