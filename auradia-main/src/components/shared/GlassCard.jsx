import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, delay = 0, onClick, glow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileTap={onClick ? { scale: 0.975 } : undefined}
      onClick={onClick}
      className={cn(
        "rounded-3xl p-5",
        "bg-white/50 backdrop-blur-2xl border border-white/60",
        "shadow-[0_4px_24px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]",
        glow && "ring-1 ring-purple-200/50 shadow-[0_4px_24px_rgba(168,85,247,0.12)]",
        onClick && "cursor-pointer transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}