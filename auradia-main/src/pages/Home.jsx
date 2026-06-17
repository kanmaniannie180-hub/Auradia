import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import GreetingCard from "@/components/home/GreetingCard";
import TodayMoodSnapshot from "@/components/home/TodayMoodSnapshot";
import SuggestionCard from "@/components/home/SuggestionCard";
import StreakCounter from "@/components/home/StreakCounter";
import QuickActions from "@/components/home/QuickActions";
import GratitudePreview from "@/components/home/GratitudePreview";
import InsightChip from "@/components/home/InsightChip";
import SmartTrigger from "@/components/home/SmartTrigger";

function calculateStreak(notes) {
  if (!notes || notes.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sorted = [...notes].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  let checkDate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toDateString();
    const hasEntry = sorted.some(n => new Date(n.created_date).toDateString() === dateStr);
    if (hasEntry) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
    else if (i === 0) { checkDate.setDate(checkDate.getDate() - 1); continue; }
    else break;
  }
  return streak;
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem("auradia_splash_shown");
    if (!hasSeenSplash) { navigate(createPageUrl("Splash"), { replace: true }); return; }
    base44.auth.me().then(u => setUserName(u?.full_name || "")).catch(() => {});
  }, [navigate]);

  const { data: moods = [] } = useQuery({
    queryKey: ["moods"],
    queryFn: () => base44.entities.Mood.list("-created_date", 20),
  });
  const { data: gratitudes = [] } = useQuery({
    queryKey: ["gratitudes"],
    queryFn: () => base44.entities.GratitudeNote.list("-created_date", 5),
  });

  const { data: voiceEntries = [] } = useQuery({
    queryKey: ["voice-entries-home"],
    queryFn: () => base44.entities.VoiceEntry.list("-created_date", 5),
  });

  const lastMood = moods[0] || null;
  const lastGratitude = gratitudes[0] || null;
  const streakDays = calculateStreak(gratitudes);
  const currentMoodType = lastMood?.emotion || "default";

  return (
    <AnimatedBackground mood={currentMoodType}>
      <div className="max-w-lg mx-auto px-4 pt-8 pb-32 space-y-4" style={{ perspective: 1200 }}>
        <GreetingCard userName={userName} lastMood={lastMood} />

        <TodayMoodSnapshot lastMood={lastMood} />

        <SuggestionCard lastMood={lastMood} moods={moods} streakDays={streakDays} gratitudeCount={gratitudes.length} />

        <div className="grid grid-cols-2 gap-3">
          <StreakCounter streakDays={streakDays} />
          <GratitudePreview lastGratitude={lastGratitude} />
        </div>

        <QuickActions />

        <SmartTrigger moods={moods} voiceEntries={voiceEntries} />

        <InsightChip moods={moods} />
      </div>
    </AnimatedBackground>
  );
}