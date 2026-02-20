import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

export async function GET() {
  const memories: { timestamp: string; content: string; type: string }[] = [];

  // Read from learning trace and extract recent learnings
  try {
    const tracePath = path.join(MEMORY_DIR, "learning", "trace.jsonl");
    const content = fs.readFileSync(tracePath, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());
    
    // Get last 10 trace items
    const recentTraces = lines.slice(-10).map((line) => {
      try { return JSON.parse(line); } catch { return null; }
    }).filter(Boolean);
    
    for (const trace of recentTraces as any[]) {
      let type = "observation";
      if (trace.backtracked) type = "learning";
      else if (trace.type === "insight") type = "learning";
      else if (trace.type === "decision") type = "decision";
      else if (trace.action) type = "action";
      
      const contentParts = [trace.action || trace.hypothesis || trace.step].filter(Boolean);
      if (trace.outcome) contentParts.push(`→ ${trace.outcome}`);
      const content = contentParts.join(" ");
      
      memories.push({
        timestamp: trace.timestamp || new Date().toISOString(),
        content: content || "(no details)",
        type,
      });
    }
  } catch {
    // If no trace file, return sample data
    memories.push(
      {
        timestamp: new Date().toISOString(),
        content: "System initialized",
        type: "observation",
      }
    );
  }

  // Sort by timestamp descending
  memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ memories: memories.slice(0, 10) });
}
