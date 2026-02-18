import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Memory directory path - check multiple locations
function getMemoryDir() {
  const locations = [
    process.env.MEMORY_DIR,
    path.join(process.cwd(), "memory"),
    path.join(process.cwd(), "..", "memory"),
    "/var/task/memory",
  ];
  
  for (const loc of locations) {
    if (loc && fs.existsSync(loc)) {
      return loc;
    }
  }
  
  return path.join(process.cwd(), "memory");
}

const MEMORY_DIR = getMemoryDir();

function readJsonFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function readJsonlFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return content
      .trim()
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

function parseWorkQueue(content: string) {
  const sections = { high: [] as string[], medium: [] as string[], low: [] as string[] };
  let currentPriority: "high" | "medium" | "low" | null = null;

  for (const line of content.split("\n")) {
    if (line.includes("Priority: High")) currentPriority = "high";
    else if (line.includes("Priority: Medium")) currentPriority = "medium";
    else if (line.includes("Priority: Low")) currentPriority = "low";
    else if (currentPriority && line.trim().startsWith("- [ ]")) {
      const task = line.replace("- [ ]", "").trim();
      sections[currentPriority].push(task);
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
  let inSubtasks = false;
  let inNotes = false;

  for (const line of lines) {
    if (line.startsWith("## Current Focus:")) {
      title = line.replace("## Current Focus:", "").trim();
    } else if (line.startsWith("**Started:**")) {
      started = line.replace("**Started:**", "").trim();
    } else if (line.startsWith("**Status:**")) {
      status = line.replace("**Status:**", "").trim();
    } else if (line.includes("### Subtasks")) {
      inSubtasks = true;
      inNotes = false;
    } else if (line.includes("### Notes")) {
      inSubtasks = false;
      inNotes = true;
    } else if (inSubtasks && line.trim().startsWith("- [")) {
      const done = line.includes("[x]");
      const text = line.replace(/- \[[ x]\]/, "").trim();
      subtasks.push({ text, done });
    } else if (inNotes && line.trim() && !line.startsWith("#")) {
      notes += line + "\n";
    }
  }

  return { title, started, status, subtasks, notes: notes.trim() };
}

export async function GET() {
  // Read all data files
  const status = readJsonFile(path.join(MEMORY_DIR, "status.json")) || {
    online: false,
    lastActive: new Date().toISOString(),
    currentTask: "No active task",
    mode: "idle",
    uptime: "0m",
    sessionsToday: 0,
    tokensUsed: 0,
  };

  let workQueue: { high: string[]; medium: string[]; low: string[] } = { high: [], medium: [], low: [] };
  try {
    const queueContent = fs.readFileSync(path.join(MEMORY_DIR, "work-queue.md"), "utf-8");
    workQueue = parseWorkQueue(queueContent);
  } catch {
    // Use defaults
  }

  let workActive: { title: string; started: string; status: string; subtasks: { text: string; done: boolean }[]; notes: string } = { title: "No active task", started: "", status: "Idle", subtasks: [], notes: "" };
  try {
    const activeContent = fs.readFileSync(path.join(MEMORY_DIR, "work-active.md"), "utf-8");
    workActive = parseWorkActive(activeContent);
  } catch {
    // Use defaults
  }

  const trace = readJsonlFile(path.join(MEMORY_DIR, "learning", "trace.jsonl"));
  const scores = readJsonlFile(path.join(MEMORY_DIR, "learning", "scores.jsonl"));

  return NextResponse.json({
    status,
    workQueue,
    workActive,
    trace,
    scores,
  });
}
