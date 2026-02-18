"use client";

interface WorkQueueProps {
  queue: { high: string[]; medium: string[]; low: string[] };
  active: { title: string; started: string; status: string };
}

export default function WorkQueue({ queue, active }: WorkQueueProps) {
  const priorityColors = {
    high: "border-l-[var(--error)]",
    medium: "border-l-[var(--warning)]",
    low: "border-l-[var(--muted)]",
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Work Queue</h2>

      {/* Active Task */}
      <div className="mb-4 p-3 bg-[var(--accent-muted)]/20 rounded-lg border border-[var(--accent)]/30">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] pulse" />
          <span className="text-xs text-[var(--accent)] uppercase font-medium">Active</span>
        </div>
        <p className="text-sm">{active.title}</p>
        <p className="text-xs text-[var(--muted)] mt-1">{active.status}</p>
      </div>

      {/* Pending Tasks */}
      <div className="space-y-2">
        {queue.high.map((task, i) => (
          <div
            key={`high-${i}`}
            className={`pl-3 py-2 border-l-2 ${priorityColors.high} bg-[var(--card-border)]/30 rounded-r`}
          >
            <span className="text-xs text-[var(--error)] uppercase mr-2">High</span>
            <span className="text-sm">{task}</span>
          </div>
        ))}
        {queue.medium.map((task, i) => (
          <div
            key={`med-${i}`}
            className={`pl-3 py-2 border-l-2 ${priorityColors.medium} bg-[var(--card-border)]/30 rounded-r`}
          >
            <span className="text-xs text-[var(--warning)] uppercase mr-2">Med</span>
            <span className="text-sm">{task}</span>
          </div>
        ))}
        {queue.low.slice(0, 2).map((task, i) => (
          <div
            key={`low-${i}`}
            className={`pl-3 py-2 border-l-2 ${priorityColors.low} bg-[var(--card-border)]/30 rounded-r`}
          >
            <span className="text-xs text-[var(--muted)] uppercase mr-2">Low</span>
            <span className="text-sm">{task}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--card-border)]">
        <span className="text-xs text-[var(--muted)]">
          {queue.high.length + queue.medium.length + queue.low.length} tasks pending
        </span>
      </div>
    </div>
  );
}
