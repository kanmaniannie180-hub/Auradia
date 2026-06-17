import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";
import CapsuleCard from "@/components/timeCapsule/CapsuleCard";
import CapsuleCreator from "@/components/timeCapsule/CapsuleCreator";
import CapsuleDetailModal from "@/components/timeCapsule/CapsuleDetailModal";

// Ambient blobs for the background
const BLOBS = [
  { color: "from-indigo-300/20 to-violet-300/10", size: "w-80 h-80", pos: "-top-20 -left-20", delay: 0 },
  { color: "from-purple-300/15 to-pink-200/10",   size: "w-96 h-96", pos: "-bottom-28 -right-20", delay: 7 },
  { color: "from-blue-200/20 to-indigo-100/10",   size: "w-64 h-64", pos: "top-1/2 -left-16",    delay: 14 },
];

export default function TimeCapsule() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreator, setShowCreator] = useState(false);
  const [activeCapsule, setActiveCapsule] = useState(null);
  const [lockedPreview, setLockedPreview] = useState(null);
  const [filter, setFilter] = useState("all");
  const [fabHover, setFabHover] = useState(false);

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: capsules = [], isLoading } = useQuery({
    queryKey: ["capsules"],
    queryFn: () => base44.entities.TimeCapsule.list("-created_date", 50),
  });

  const openMutation = useMutation({
    mutationFn: (id) => base44.entities.TimeCapsule.update(id, { status: "opened", opened_at: new Date().toISOString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["capsules"] }),
  });

  const getUnlockTime = (c) => { const d = new Date(c.unlock_date); d.setHours(23, 59, 59, 999); return d.getTime(); };
  const isUnlockable = (c) => Date.now() >= getUnlockTime(c) && c.status !== "opened";
  const isLocked     = (c) => Date.now() < getUnlockTime(c) && c.status !== "opened";

  const locked     = capsules.filter(isLocked);
  const unlockable = capsules.filter(isUnlockable);
  const opened     = capsules.filter(c => c.status === "opened");

  const filteredCapsules = filter === "locked" ? locked
    : filter === "unlockable" ? unlockable
    : filter === "opened"     ? opened
    : capsules;

  const handleOpenCapsule = (capsule) => {
    if (isUnlockable(capsule)) {
      openMutation.mutate(capsule.id);
      setActiveCapsule({ ...capsule, status: "opened", opened_at: new Date().toISOString() });
    } else if (capsule.status === "opened") {
      setActiveCapsule(capsule);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 relative overflow-hidden">

      {/* Ambient animated blobs */}
      {BLOBS.map((blob, i) => (
        <motion.div key={i}
          className={`absolute ${blob.pos} ${blob.size} rounded-full bg-gradient-to-br ${blob.color} blur-3xl pointer-events-none`}
          animate={{ x: [0, 20, -12, 0], y: [0, -14, 10, 0], scale: [1, 1.05, 0.97, 1] }}
          transition={{ duration: 22, repeat: Infinity, delay: blob.delay, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-36 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(createPageUrl("Home"))}
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {/* Premium FAB-style button */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.91 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              onHoverStart={() => setFabHover(true)}
              onHoverEnd={() => setFabHover(false)}
              onClick={() => setShowCreator(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-white text-xs font-bold relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.45)",
              }}
            >
              <motion.div className="absolute inset-0 bg-white/10"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
              <Plus className="w-3.5 h-3.5 relative z-10" />
              <AnimatePresence>
                {fabHover ? (
                  <motion.span key="label" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap">
                    Create Capsule
                  </motion.span>
                ) : (
                  <motion.span key="short" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="relative z-10">New</motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Time Capsule</h1>
          <p className="text-sm text-gray-400 mt-1">Your emotional vault across time</p>
        </div>

        {/* Stats */}
        {capsules.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[
              { label: "Locked",  value: locked.length,     emoji: "🔒", color: "from-indigo-50 to-violet-50", border: "border-indigo-100" },
              { label: "Ready",   value: unlockable.length, emoji: "🔓", color: "from-emerald-50 to-teal-50",  border: "border-emerald-100" },
              { label: "Opened",  value: opened.length,     emoji: "✨", color: "from-amber-50 to-yellow-50",  border: "border-amber-100" },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl px-3 py-3 text-center shadow-sm`}>
                <span className="text-xl block mb-1">{s.emoji}</span>
                <p className="text-lg font-bold text-gray-800">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        {capsules.length > 0 && (
          <div className="flex gap-1.5 mb-5 bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-1.5">
            {[
              { key: "all",        label: "All" },
              { key: "locked",     label: "🔒 Locked" },
              { key: "unlockable", label: "🔓 Ready" },
              { key: "opened",     label: "✨ Opened" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                  filter === f.key ? "bg-white/80 text-indigo-600 shadow-sm" : "text-gray-400"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Unlockable alert banner */}
        {unlockable.length > 0 && filter !== "locked" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-px rounded-2xl">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                <motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">🔓</motion.span>
                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    {unlockable.length} memory {unlockable.length === 1 ? "is" : "are"} ready to open!
                  </p>
                  <p className="text-xs text-emerald-600">Tap to unseal and reflect</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Capsule grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredCapsules.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl block mb-4">🔐</motion.div>
            <p className="text-gray-600 font-medium">
              {filter === "unlockable" ? "No memories ready to open yet"
               : filter === "opened"  ? "No opened memories yet"
               : filter === "locked"  ? "Nothing locked away yet"
               : "No capsules yet"}
            </p>
            {filter === "all" && (
              <>
                <p className="text-sm text-gray-400 mt-1">Seal a memory for your future self</p>
                <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowCreator(true)}
                  className="mt-5 px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-md"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  + Seal First Memory
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCapsules.map((capsule, i) => (
              <CapsuleCard key={capsule.id} capsule={capsule} index={i} onOpen={handleOpenCapsule} onPreview={setLockedPreview} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreator && <CapsuleCreator onClose={() => setShowCreator(false)} onSealed={() => setShowCreator(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {activeCapsule && <CapsuleDetailModal capsule={activeCapsule} onClose={() => setActiveCapsule(null)} onUpdate={() => setActiveCapsule(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {lockedPreview && <LockedCapsuleModal capsule={lockedPreview} onClose={() => setLockedPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}