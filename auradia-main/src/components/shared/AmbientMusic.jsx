import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX } from "lucide-react";

// Uses a free ambient tone via Web Audio API — no external file needed
function createAmbientNode(ctx) {
  const oscillator1 = ctx.createOscillator();
  const oscillator2 = ctx.createOscillator();
  const oscillator3 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filterNode = ctx.createBiquadFilter();

  oscillator1.type = "sine";
  oscillator1.frequency.setValueAtTime(174.6, ctx.currentTime); // F3
  oscillator2.type = "sine";
  oscillator2.frequency.setValueAtTime(261.6, ctx.currentTime); // C4
  oscillator3.type = "sine";
  oscillator3.frequency.setValueAtTime(349.2, ctx.currentTime); // F4

  filterNode.type = "lowpass";
  filterNode.frequency.setValueAtTime(800, ctx.currentTime);

  [oscillator1, oscillator2, oscillator3].forEach(osc => osc.connect(filterNode));
  filterNode.connect(gainNode);
  gainNode.connect(ctx.destination);
  gainNode.gain.setValueAtTime(0, ctx.currentTime);

  oscillator1.start();
  oscillator2.start();
  oscillator3.start();

  return { gainNode, oscillators: [oscillator1, oscillator2, oscillator3] };
}

export default function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(() => localStorage.getItem("auradia_music") === "on");
  const [isVisible, setIsVisible] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);

  useEffect(() => {
    // Show after 1 second
    const t = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const toggleMusic = async () => {
    if (!isPlaying) {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        nodesRef.current = createAmbientNode(ctxRef.current);
      }
      if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
      const gain = nodesRef.current.gainNode;
      gain.gain.cancelScheduledValues(ctxRef.current.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctxRef.current.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctxRef.current.currentTime + 2);
      setIsPlaying(true);
      localStorage.setItem("auradia_music", "on");
    } else {
      if (nodesRef.current) {
        const gain = nodesRef.current.gainNode;
        gain.gain.cancelScheduledValues(ctxRef.current.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctxRef.current.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 1.5);
      }
      setIsPlaying(false);
      localStorage.setItem("auradia_music", "off");
    }
  };

  useEffect(() => {
    // Auto-start if saved preference
    if (isPlaying) toggleMusic();
    return () => {
      nodesRef.current?.oscillators.forEach(o => { try { o.stop(); } catch (_) {} });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onClick={toggleMusic}
        title={isPlaying ? "Pause ambient music" : "Play ambient music"}
        className="fixed bottom-[100px] right-4 z-50 w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/70 shadow-lg flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Music className="w-4 h-4 text-purple-500" />
            </motion.div>
          ) : (
            <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <VolumeX className="w-4 h-4 text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-2xl border border-purple-300/50"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </AnimatePresence>
  );
}