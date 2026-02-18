"use client";

import { useEffect, useState } from "react";
import StatusPanel from "@/components/StatusPanel";
import WorkQueue from "@/components/WorkQueue";
import LearningTrace from "@/components/LearningTrace";
import WideView from "@/components/WideView";
import DeepView from "@/components/DeepView";
import MemoryStream from "@/components/MemoryStream";
import DailyScore from "@/components/DailyScore";

interface DashboardData {
  status: {
    online: boolean;
    lastActive: string;
    currentTask: string;
    mode: string;
    uptime: string;
    sessionsToday: number;
    tokensUsed: number;
  };
  workQueue: { high: string[]; medium: string[]; low: string[] };
  workActive: { title: string; started: string; status: string; subtasks: { text: string; done: boolean }[]; notes: string };
  trace: { id: string; timestamp: string; step: string; parent: string | null; type: string; confidence: number }[];
  scores: { date: string; connections: number; predictions: number; depth: number; breadth: number; backtrack: number; transfer: number; total: number }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeView, setActiveView] = useState<"wide" | "deep">("wide");

  useEffect(() => {
    const EC2_API = "https://tradition-practical-union-preferred.trycloudflare.com/api/all";

    const fetchData = async () => {
      try {
        // Try live EC2 API directly from browser
        const res = await fetch(EC2_API, { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        const raw = await res.json();

        // Map EC2 fields to dashboard format
        const mapped: DashboardData = {
          status: {
            online: raw.status?.state === "online",
            lastActive: raw.status?.lastActive || new Date().toISOString(),
            currentTask: raw.status?.currentTask || "No active task",
            mode: raw.status?.mode || "idle",
            uptime: raw.status?.uptime || "0m",
            sessionsToday: raw.status?.sessions || 0,
            tokensUsed: raw.status?.tokens || 0,
          },
          workQueue: { high: [], medium: [], low: [] },
          workActive: { title: "Loading...", started: "", status: "", subtasks: [], notes: "" },
          trace: raw.trace || [],
          scores: raw.scores || [],
        };
        setData(mapped);
      } catch {
        // Fall back to Vercel API if EC2 unreachable
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-[var(--muted)] pulse">Loading PAUL-OS...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">PAUL-OS</h1>
          <span className="text-sm text-[var(--muted)]">Autonomous Work Tracker</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("wide")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeView === "wide" 
                ? "bg-[var(--accent)] text-white" 
                : "bg-[var(--card)] text-[var(--muted)] hover:text-white"
            }`}
          >
            Wide View
          </button>
          <button
            onClick={() => setActiveView("deep")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeView === "deep" 
                ? "bg-[var(--accent)] text-white" 
                : "bg-[var(--card)] text-[var(--muted)] hover:text-white"
            }`}
          >
            Deep View
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Status & Scores */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <StatusPanel status={data.status} />
          <DailyScore scores={data.scores} />
        </div>

        {/* Center Column - Main View */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {activeView === "wide" ? (
            <WideView />
          ) : (
            <DeepView workActive={data.workActive} />
          )}
          <LearningTrace trace={data.trace} />
        </div>

        {/* Right Column - Queue & Memory */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <WorkQueue queue={data.workQueue} active={data.workActive} />
          <MemoryStream />
        </div>
      </div>
    </main>
  );
}
