import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone, Share } from "lucide-react";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.navigator.standalone === true) return;
    if (localStorage.getItem("pwa_installed")) return;
    if (sessionStorage.getItem("pwa_dismissed")) return;

    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    const android = /android/i.test(ua);
    const desktop = !ios && !android;
    setIsIOS(ios);
    setIsDesktop(desktop);

    if (ios) {
      setTimeout(() => setShow(true), 2000);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 2000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show manual tip for Android if prompt doesn't fire
    let fallbackTimer;
    if (android) {
      fallbackTimer = setTimeout(() => {
        if (!deferredPrompt) setShow(true);
      }, 3500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        localStorage.setItem("pwa_installed", "1");
        setTimeout(() => setShow(false), 2000);
      } else {
        setShow(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("pwa_dismissed", "1");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center px-4 pb-6"
          >
            <div
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(32px)",
                boxShadow: "0 -4px 0 rgba(168,85,247,0.3), 0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(168,85,247,0.15)",
              }}
            >
              {/* Top gradient bar */}
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-rose-400" />

              <div className="p-6">
                {/* App icon + close */}
                <div className="flex items-start justify-between mb-5">
                  <motion.div
                    animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #ec4899)",
                      boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
                    }}
                  >
                    🌙
                  </motion.div>
                  <button
                    onClick={handleDismiss}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Text */}
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {installed ? "Auradia Installed! 🎉" : "Install Auradia"}
                  </h2>
                  {!installed && (
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {isIOS
                        ? "Add to your home screen for a full-screen, app-like experience."
                        : "Get the full experience — works offline, loads instantly, feels native."}
                    </p>
                  )}
                  {installed && (
                    <p className="text-sm text-gray-400">You can now open Auradia from your home screen.</p>
                  )}
                </div>

                {/* Feature pills */}
                {!installed && (
                  <div className="flex gap-2 flex-wrap mb-5">
                    {["Works offline", "No browser bar", "Instant load", "Native feel"].map((f) => (
                      <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 font-medium border border-purple-100">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {!installed && (
                  <>
                    {isIOS ? (
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <Share className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Tap <strong>Share</strong> in Safari</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Then tap <strong>Add to Home Screen</strong></p>
                        </div>
                      </div>
                    ) : deferredPrompt ? (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={handleInstall}
                        className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 relative overflow-hidden mb-3"
                        style={{
                          background: "linear-gradient(135deg, #a855f7, #ec4899)",
                          boxShadow: "0 8px 24px rgba(168,85,247,0.35)",
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/15"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <Download className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Add to Home Screen</span>
                      </motion.button>
                    ) : (
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3">
                        <p className="text-sm text-gray-600">
                          Open <strong>⋮ Menu</strong> → <strong>Add to Home Screen</strong>
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleDismiss}
                      className="w-full py-2.5 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
                    >
                      Maybe later
                    </button>
                  </>
                )}

                {/* Installed success */}
                {installed && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center py-2"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-3xl shadow-lg">
                      ✓
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}