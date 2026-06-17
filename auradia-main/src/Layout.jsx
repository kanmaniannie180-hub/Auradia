import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BarChart3, Wind, Grid3X3, Plus } from "lucide-react";
import AmbientMusic from "@/components/shared/AmbientMusic";
import PWAInstallBanner from "@/components/shared/PWAInstallBanner";
import Cursor3D from "@/components/shared/Cursor3D";

const NAV_ITEMS = [
  { label: "Home", icon: Home, page: "Home" },
  { label: "Mood", icon: BarChart3, page: "EmotionalMap" },
  { label: "", icon: null, page: "" },
  { label: "Calm", icon: Wind, page: "CalmZone" },
  { label: "More", icon: Grid3X3, page: "More" },
];

const HIDDEN_NAV_PAGES = ["AIMoodCoach", "Splash"];

export default function Layout({ children, currentPageName }) {
  const showNav = !HIDDEN_NAV_PAGES.includes(currentPageName);

  return (
    <div className="min-h-screen relative">
      {children}

      <AmbientMusic />
      <PWAInstallBanner />
      <Cursor3D />

      {showNav && (
        <>
          {/* FAB */}
          <Link to={createPageUrl("MoodBubbles")}>
            <motion.div
              className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              style={{ boxShadow: "0 4px 24px rgba(168, 85, 247, 0.45)" }}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.06 }}
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.div>
          </Link>

          {/* Nav bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
            <div className="max-w-lg mx-auto px-3 pb-3">
              <div className="rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_-2px_24px_rgba(0,0,0,0.06)] px-1 py-1.5">
                <div className="flex items-center justify-around">
                  {NAV_ITEMS.map((item, i) => {
                    if (!item.icon) return <div key={i} className="w-14" />;
                    const isActive = currentPageName === item.page;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.page}
                        to={createPageUrl(item.page)}
                        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative"
                      >
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              layoutId="nav-bg"
                              className="absolute inset-0 rounded-xl bg-purple-50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                        </AnimatePresence>
                        <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                        <span className={`text-[10px] relative z-10 font-medium ${isActive ? "text-purple-600" : "text-gray-400"}`}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}