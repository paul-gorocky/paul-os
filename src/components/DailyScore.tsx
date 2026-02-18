"use client";

interface Score {
  date: string;
  connections: number;
  predictions: number;
  depth: number;
  breadth: number;
  backtrack: number;
  transfer: number;
  total: number;
}

interface DailyScoreProps {
  scores: Score[];
}

export default function DailyScore({ scores }: DailyScoreProps) {
  const today = scores[scores.length - 1];
  const yesterday = scores[scores.length - 2];

  const categories = [
    { key: "connections", label: "Connections", color: "bg-blue-500", max: 10, desc: "Links between concepts" },
    { key: "predictions", label: "Predictions", color: "bg-purple-500", max: 10, desc: "Anticipating outcomes" },
    { key: "depth", label: "Depth", color: "bg-green-500", max: 10, desc: "Deep understanding" },
    { key: "breadth", label: "Breadth", color: "bg-yellow-500", max: 10, desc: "Wide exploration" },
    { key: "backtrack", label: "Backtrack", color: "bg-orange-500", max: 10, desc: "Course corrections" },
    { key: "transfer", label: "Transfer", color: "bg-pink-500", max: 10, desc: "Knowledge application" },
  ] as const;

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return { icon: "↑", color: "text-[var(--success)]" };
    if (current < previous) return { icon: "↓", color: "text-[var(--error)]" };
    return { icon: "=", color: "text-[var(--muted)]" };
  };

  if (!today) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Daily Score</h2>
        <p className="text-sm text-[var(--muted)]">No scores recorded today</p>
      </div>
    );
  }

  const totalTrend = yesterday ? getTrend(today.total, yesterday.total) : null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Daily Score</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{today.total}</span>
          {totalTrend && (
            <span className={`text-sm ${totalTrend.color}`}>{totalTrend.icon}</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const value = today[cat.key];
          const prevValue = yesterday?.[cat.key] || 0;
          const trend = yesterday ? getTrend(value, prevValue) : null;

          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--muted)]">{cat.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{value}</span>
                  {trend && (
                    <span className={`text-xs ${trend.color}`}>{trend.icon}</span>
                  )}
                </div>
              </div>
              <div className="score-bar">
                <div
                  className={`h-full rounded ${cat.color}`}
                  style={{ width: `${(value / cat.max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini sparkline for last 3 days */}
      <div className="mt-4 pt-3 border-t border-[var(--card-border)]">
        <span className="text-xs text-[var(--muted)]">Last 3 days: </span>
        <span className="text-xs">
          {scores.map((s, i) => (
            <span key={i} className="inline-block mx-1">
              {s.total}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
