import React, { useState, useRef, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { ChevronLeft, Check, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { detectEmotion, analyzePatterns, EMOTION_CONFIG } from "@/lib/emotionEngine";
import RecordingOrb from "@/components/voiceJournal/RecordingOrb";
import EmotionAnalysisCard from "@/components/voiceJournal/EmotionAnalysisCard";
import VoiceEntryCard from "@/components/voiceJournal/VoiceEntryCard";
import EmotionPatternCard from "@/components/voiceJournal/EmotionPatternCard";
import { Textarea } from "@/components/ui/textarea";

const TAGS = ["release", "stress", "gratitude", "thoughts", "processing", "clarity", "memory", "growth"];

export default function VoiceJournal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Recording state
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // Post-recording state
  const [transcript, setTranscript] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("record"); // "record" | "history" | "patterns"

  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  const { data: entries = [] } = useQuery({
    queryKey: ["voice-entries"],
    queryFn: () => base44.entities.VoiceEntry.list("-created_date", 40),
  });

  const patterns = useMemo(() => analyzePatterns(entries), [entries]);

  const saveMutation = useMutation({
    mutationFn: async (analysisData) => {
      const file = new File([audioBlob], "voice-entry.webm", { type: "audio/webm" });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return base44.entities.VoiceEntry.create({
        audio_url: file_url,
        duration_seconds: elapsed,
        transcript: transcript.trim() || undefined,
        detected_emotion: analysisData.emotion,
        intensity: analysisData.intensity,
        intensity_score: analysisData.intensityScore,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice-entries"] });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setAudioBlob(null); setAudioUrl(null); setElapsed(0);
        setTranscript(""); setSelectedTags([]); setAnalysis(null);
        setActiveTab("history");
      }, 1800);
    },
  });

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];
    mediaRecorder.current.ondataavailable = e => chunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach(t => t.stop());
    };
    mediaRecorder.current.start();
    setRecording(true);
    setElapsed(0);
    setAnalysis(null);
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev >= 179) { stopRecording(); return 179; }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const handleTranscriptChange = (text) => {
    setTranscript(text);
    if (text.trim().length >= 5) {
      const result = detectEmotion(text);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  };

  const handleSave = () => {
    const finalAnalysis = analysis || detectEmotion(transcript);
    saveMutation.mutate(finalAnalysis);
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setElapsed(0);
    setTranscript("");
    setAnalysis(null);
    setSelectedTags([]);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const dominantCfg = analysis ? EMOTION_CONFIG[analysis.emotion] : null;

  return (
    <AnimatedBackground mood={analysis?.emotion || "default"}>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-36 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(createPageUrl("Home"))}
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/60 flex items-center justify-center text-lg shadow-sm"
          >
            🎙️
          </motion.div>
        </div>

        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Voice Journal</h1>
          <p className="text-sm text-gray-400 mt-0.5">Speak, reflect, understand your emotions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-5 bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-1.5">
          {[
            { key: "record", label: "Record" },
            { key: "history", label: `History ${entries.length > 0 ? `(${entries.length})` : ""}` },
            { key: "patterns", label: "Patterns" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.key ? "bg-white/80 text-purple-600 shadow-sm" : "text-gray-400"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── RECORD TAB ── */}
          {activeTab === "record" && (
            <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

              {saved ? (
                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center py-16 gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
                      <Check className="w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                    {[1, 2].map(i => (
                      <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-emerald-300/40"
                        initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 1.6 + i * 0.3, opacity: 0 }}
                        transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} />
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">Reflection saved! ✨</p>
                    {analysis && (
                      <p className="text-sm text-gray-500 mt-1">
                        Detected: {EMOTION_CONFIG[analysis.emotion]?.emoji} {EMOTION_CONFIG[analysis.emotion]?.label}
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Recording orb */}
                  <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-6 flex flex-col items-center">
                    <RecordingOrb
                      recording={recording}
                      elapsed={elapsed}
                      onStart={startRecording}
                      onStop={stopRecording}
                      maxSeconds={180}
                    />

                    {/* Playback preview */}
                    {audioUrl && !recording && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-4 flex items-center gap-3 bg-purple-50/70 rounded-2xl px-3 py-2 border border-purple-100">
                        <span className="text-sm">🎙️</span>
                        <audio src={audioUrl} controls className="flex-1" style={{ height: 28 }} />
                        <button onClick={resetRecording} className="text-[10px] text-gray-400 hover:text-red-400 transition-colors ml-1">
                          ✕
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Transcript + analysis (after recording) */}
                  {audioBlob && !recording && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

                      {/* Transcript input */}
                      <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          What did you say? (optional — helps detect emotion)
                        </p>
                        <Textarea
                          value={transcript}
                          onChange={e => handleTranscriptChange(e.target.value)}
                          placeholder="Type a summary of what you spoke about… 'I feel stressed about work lately'"
                          className="bg-white/40 border-white/50 rounded-2xl resize-none h-20 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-purple-300"
                        />
                      </div>

                      {/* Live emotion analysis */}
                      <AnimatePresence>
                        {analysis && analysis.confidence > 0 && (
                          <EmotionAnalysisCard
                            emotion={analysis.emotion}
                            intensity={analysis.intensity}
                            intensityScore={analysis.intensityScore}
                            confidence={analysis.confidence}
                            transcript={transcript}
                          />
                        )}
                      </AnimatePresence>

                      {/* Tags */}
                      <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tag this entry</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {TAGS.map(tag => (
                            <button key={tag} onClick={() => setSelectedTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                              className={`px-3 py-1 rounded-full text-xs capitalize border transition-all ${
                                selectedTags.includes(tag) ? "bg-purple-100 border-purple-300 text-purple-700 font-semibold" : "bg-white/40 border-white/50 text-gray-500"
                              }`}>
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Save button */}
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-lg disabled:opacity-50 relative overflow-hidden flex items-center justify-center gap-2"
                        style={{
                          background: dominantCfg
                            ? `linear-gradient(135deg, ${dominantCfg.color}cc, #a855f7)`
                            : "linear-gradient(135deg, #a855f7, #ec4899)"
                        }}
                      >
                        <motion.div className="absolute inset-0 bg-white/10"
                          animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity }} />
                        <span className="relative z-10">
                          {saveMutation.isPending ? "Saving…" : `Save Reflection ${analysis ? EMOTION_CONFIG[analysis.emotion]?.emoji || "✨" : "✨"}`}
                        </span>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Idle state prompt */}
                  {!audioBlob && !recording && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                      className="text-center py-4 space-y-1">
                      <p className="text-sm text-gray-500 font-medium">Speak freely. This is your space.</p>
                      <p className="text-xs text-gray-400">Your voice will be analyzed for emotional tone.</p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {entries.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">🎙️</motion.div>
                  <p className="text-gray-600 font-medium">No entries yet</p>
                  <p className="text-sm text-gray-400 mt-1">Your voice reflections appear here</p>
                  <button onClick={() => setActiveTab("record")}
                    className="mt-5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-md">
                    Record your first entry
                  </button>
                </motion.div>
              ) : (
                entries.map((entry, i) => (
                  <VoiceEntryCard key={entry.id} entry={entry} index={i} />
                ))
              )}
            </motion.div>
          )}

          {/* ── PATTERNS TAB ── */}
          {activeTab === "patterns" && (
            <motion.div key="patterns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {entries.filter(e => e.detected_emotion).length < 2 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">
                    <BarChart2 className="w-12 h-12 text-purple-300 mx-auto" />
                  </motion.div>
                  <p className="text-gray-600 font-medium">Need more entries</p>
                  <p className="text-sm text-gray-400 mt-1">Record 2+ entries with transcripts to see patterns</p>
                </motion.div>
              ) : (
                <>
                  <EmotionPatternCard patterns={patterns} entries={entries} />

                  {/* Insight nudge */}
                  {patterns && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/60 rounded-3xl p-4">
                      <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider mb-2">💜 Insight</p>
                      <p className="text-sm text-violet-700 leading-relaxed">
                        {patterns.stabilityScore >= 8
                          ? "Your emotional tone has been quite steady. That's a sign of resilience and self-awareness."
                          : patterns.trend === "falling"
                          ? "Your recent entries suggest you're finding more calm. Something is working for you."
                          : patterns.trend === "rising"
                          ? "Intensity seems to be building. Consider a breathing session or a moment of reflection."
                          : "You express a wide range of emotions — that's emotional depth, not weakness."}
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedBackground>
  );
}