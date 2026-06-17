import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Card3D — wraps any children with a 3D tilt-on-hover effect.
 * Usage: <Card3D className="..."><YourContent /></Card3D>
 */
export default function Card3D({ children, className = "", intensity = 12, glowColor = "rgba(168,85,247,0.25)", onClick }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * intensity, y: dx * intensity });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovering ? 1.025 : 1,
        boxShadow: isHovering
          ? `0 20px 50px ${glowColor}, 0 8px 20px rgba(0,0,0,0.08)`
          : "0 4px 16px rgba(0,0,0,0.05)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className={className}
    >
      {/* Reflection shimmer */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                ${105 + tilt.y * 2}deg,
                transparent 30%,
                rgba(255,255,255,0.18) 50%,
                transparent 70%
              )`,
            }}
          />
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}