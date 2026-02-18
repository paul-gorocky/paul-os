import { NextResponse } from "next/server";

// EC2 API endpoint (via Cloudflare tunnel)
const EC2_API_URL = "https://tradition-practical-union-preferred.trycloudflare.com/api/all";

function parseWorkQueue(content: string) {
  const sections = { high: [] as string[], medium: [] as string[], low: [] as string[] };
  let currentPriority: "high" | "medium" | "low" | null = null;

  for (const line of content.split("\n")) {
    if (line.includes("Priority 1") || line.includes("Priority: High")) currentPriority = "high";
    else if (line.includes("Priority 2") || line.includes("Priority: Medium")) currentPriority = "medium";
    else if (line.includes("Priority 3") || line.includes("Priority: Low") || line.includes("Backlog")) currentPriority = "low";
    else if (currentPriority && (line.trim().startsWith("- [ ]") || line.trim().startsWith("- [x]"))) {
      const task = line.replace(/- \[[ x]\]/, "").trim();
      if (!line.includes("[x]")) {
        sections[currentPriority].push(task);
      }
    }
  }

  return sections;
}

function parseWorkActive(content: string) {
  const lines = content.split("\n");
  let title = "Unknown Task";
  let started = "";
  let status = "Unknown";
  const subtasks: { text: string; done: boolean }[] = [];
  let notes = "";
  let inProgress = false;
  let inLearnings = false;

  for (const line of lines) {
    if (line.startsWith("## Task:") || line.startsWith("## Current Focus:")) {
      title = line.replace(/## (Task:|Current Focus:)/, "").trim();
    } else if (line.startsWith("**Started:**")) {
      started = line.replace("**Started:**", "").trim();
    } else if (line.startsWith("**Status:**")) {
      status = line.replace("**Status:**", "").trim();
    } else if (line.includes("### Progress") || line.includes("### Subtasks")) {
      inProgress = true;
      inLearnings = false;
    } else if (line.includes("### Learnings") || line.includes("### Notes")) {
      inProgress = false;
      inLearnings = true;
    } else if (inProgress && line.trim().startsWith("- [")) {
      const done = line.includes("[x]");
      const text = line.replace(/- \[[ x]\]/, "").trim();
      subtasks.push({ text, done });
    } else if (inLearnings && line.trim().startsWith("-")) {
      notes += line.replace(/^- /, "").trim() + "\n";
    }
  }

  return { title, started, status, subtasks, notes: notes.trim() };
}

export async function GET() {
  try {
    // Try to fetch from EC2 API
    const response = await fetch(EC2_API_URL, {
      next: { revalidate: 10 }, // Cache for 10 seconds
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match dashboard expectations
    const rawStatus = data.status || {};
    const status = {
      online: rawStatus.state === "online" || rawStatus.online === true,
      lastActive: rawStatus.lastActive || new Date().toISOString(),
      currentTask: rawStatus.currentTask || "No active task",
      mode: rawStatus.mode || "idle",
      uptime: rawStatus.uptime || "0m",
      sessionsToday: rawStatus.sessions || rawStatus.sessionsToday || 0,
      tokensUsed: rawStatus.tokens || rawStatus.tokensUsed || 0,
    };
    
    const workQueue = parseWorkQueue(data.queue || "");
    const workActive = parseWorkActive(data.active || "");
    const trace = data.trace || [];
    const scores = data.scores || [];
    
    return NextResponse.json({
      status,
      workQueue,
      workActive,
      trace,
      scores,
      source: "live",
      timestamp: data.timestamp,
    });
  } catch (error) {
    // Fallback to default values if API is unreachable
    console.error("Failed to fetch from EC2 API:", error);
    
    return NextResponse.json({
      status: {
        state: "offline",
        lastActive: new Date().toISOString(),
        currentTask: "API unreachable",
        mode: "unknown",
        uptime: "0m",
        sessions: 0,
        tokens: 0,
      },
      workQueue: { high: [], medium: [], low: [] },
      workActive: { 
        title: "Unable to fetch active work", 
        started: "", 
        status: "API unreachable", 
        subtasks: [], 
        notes: "" 
      },
      trace: [],
      scores: [],
      source: "fallback",
      error: "EC2 API unreachable",
    });
  }
}
