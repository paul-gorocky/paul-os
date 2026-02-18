"use client";

import { useEffect, useState } from "react";

interface MemoryItem {
  timestamp: string;
  content: string;
  type: "learning" | "decision" | "observation" | "reminder";
}

export default function MemoryStream() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch("/api/memory");
        const data = await res.json();
        setMemories(data.memories || []);
      } catch {
        // Use sample data if API fails
        setMemories([
          {
            timestamp: new Date().toISOString(),
            content: "File-based data is simpler than SQLite for this use case",
            type: "learning",
          },
          {
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            content: "Dark theme with cyan accents works well",
            type: "decision",
          },
          {
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            content: "Next.js App Router is stable for production",
            type: "observation",
          },
        ]);
      }
    };
    fetchMemories();
  }, []);

  const typeIcons: Record<string, string> = {
    learning: "📚",
    decision: "⚖️",
    observation: "👁️",
    reminder: "🔔",
  };

  const typeColors: Record<string, string> = {
    learning: "border-l-purple-500",
    decision: "border-l-[var(--success)]",
    observation: "border-l-[var(--accent)]",
    reminder: "border-l-[var(--warning)]",
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Memory Stream</h2>

      <div className="space-y-3">
        {memories.map((memory, i) => (
          <div
            key={i}
            className={`pl-3 py-2 border-l-2 ${typeColors[memory.type]} bg-[var(--card-border)]/20 rounded-r`}
          >
            <div className="flex items-start gap-2">
              <span className="text-sm">{typeIcons[memory.type]}</span>
              <div className="flex-1">
                <p className="text-sm">{memory.content}</p>
                <span className="text-xs text-[var(--muted)]">
                  {new Date(memory.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <p className="text-sm text-[var(--muted)] text-center py-4">
          No recent memories
        </p>
      )}
    </div>
  );
}
