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
    const recentTraces = lines.slice(-10).map((line) => JSON.parse(line));
    
    for (const trace of recentTraces) {
      let type = "observation";
      if (trace.type === "insight") type = "learning";
      else if (trace.type === "decision") type = "decision";
      else if (trace.type === "backtrack") type = "learning";
      
      memories.push({
        timestamp: trace.timestamp,
        content: trace.step,
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
