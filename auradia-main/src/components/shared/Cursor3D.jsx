import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function Cursor3D() {
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const mouseX = useSpring(0, { stiffness: 500, damping: 35 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 35 });
  const trailX = useSpring(0, { stiffness: 120, damping: 22 });
  const trailY = useSpring(0, { stiffness: 120, damping: 22 });

  useEffect(() => {
    // Only show on non-touch desktop devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
      if (!visible) setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cursor = window.getComputedStyle(el || document.body).cursor;
      setIsPointer(cursor === "pointer" || el?.tagName === "BUTTON" || el?.tagName === "A");
    };

    const down = () => setIsClick(true);
    const up = () => setIsClick(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Outer glow trail — slow follow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: isPointer ? 56 : 36,
            height: isPointer ? 56 : 36,
            opacity: isClick ? 0.9 : 0.35,
            scale: isClick ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full"
          style={{
            background: isPointer
              ? "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(236,72,153,0.2) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.05) 70%, transparent 100%)",
            filter: "blur(4px)",
          }}
        />
      </motion.div>

      {/* Core cursor dot — fast */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: isClick ? 6 : isPointer ? 10 : 8,
            height: isClick ? 6 : isPointer ? 10 : 8,
            backgroundColor: isPointer ? "#a855f7" : "#6366f1",
            boxShadow: isPointer
              ? "0 0 12px rgba(168,85,247,0.9), 0 0 24px rgba(168,85,247,0.4)"
              : "0 0 8px rgba(99,102,241,0.7)",
            scale: isClick ? 0.6 : 1,
          }}
          transition={{ duration: 0.12 }}
          className="rounded-full"
        />
      </motion.div>

      {/* Magnifier ring — appears on hover */}
      {isPointer && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[99998]"
          style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border border-purple-400/60"
            style={{
              borderStyle: "dashed",
              boxShadow: "0 0 16px rgba(168,85,247,0.3), inset 0 0 8px rgba(168,85,247,0.1)",
            }}
          />
        </motion.div>
      )}
    </>
  );
}