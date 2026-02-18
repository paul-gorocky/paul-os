"use client";

interface TraceItem {
  id: string;
  timestamp: string;
  step: string;
  parent: string | null;
  type: string;
  confidence: number;
}

interface LearningTraceProps {
  trace: TraceItem[];
}

export default function LearningTrace({ trace }: LearningTraceProps) {
  const typeColors: Record<string, string> = {
    insight: "bg-[var(--accent)]",
    research: "bg-purple-500",
    decision: "bg-[var(--success)]",
    attempt: "bg-[var(--warning)]",
    backtrack: "bg-[var(--error)]",
    action: "bg-cyan-500",
  };

  const typeLabels: Record<string, string> = {
    insight: "💡",
    research: "🔍",
    decision: "✓",
    attempt: "→",
    backtrack: "↩",
    action: "⚡",
  };

  // Build a tree structure from the trace
  const getIndentLevel = (item: TraceItem, items: TraceItem[]): number => {
    if (!item.parent) return 0;
    const parent = items.find((i) => i.id === item.parent);
    if (!parent) return 0;
    return 1 + getIndentLevel(parent, items);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Learning Trace</h2>

      <div className="space-y-1">
        {trace.map((item) => {
          const indent = getIndentLevel(item, trace);
          const isBacktrack = item.type === "backtrack";

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-2 rounded transition hover:bg-[var(--card-border)]/30 ${
                isBacktrack ? "bg-[var(--error)]/10" : ""
              }`}
              style={{ marginLeft: `${indent * 1.5}rem` }}
            >
              {/* Node indicator */}
              <div className="flex flex-col items-center">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    typeColors[item.type] || "bg-[var(--muted)]"
                  }`}
                >
                  {typeLabels[item.type] || "•"}
                </span>
                {indent > 0 && (
                  <div className="w-px h-full bg-[var(--card-border)] -mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${isBacktrack ? "text-[var(--warning)]" : ""}`}>
                  {item.step}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(item.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {Math.round(item.confidence * 100)}% conf
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex flex-wrap gap-3">
        {Object.entries(typeLabels).map(([type, emoji]) => (
          <span key={type} className="text-xs text-[var(--muted)] flex items-center gap-1">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${typeColors[type]}`}
            >
              {emoji}
            </span>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
