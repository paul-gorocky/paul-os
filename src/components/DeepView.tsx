"use client";

interface DeepViewProps {
  workActive: {
    title: string;
    started: string;
    status: string;
    subtasks: { text: string; done: boolean }[];
    notes: string;
  };
}

export default function DeepView({ workActive }: DeepViewProps) {
  const completedCount = workActive.subtasks.filter((t) => t.done).length;
  const progress = (completedCount / workActive.subtasks.length) * 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Deep View: Current Focus</h2>
        <span className="text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">
          {workActive.status}
        </span>
      </div>

      {/* Main task info */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">{workActive.title}</h3>
        <p className="text-sm text-[var(--muted)]">Started: {workActive.started}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--muted)]">Progress</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="score-bar h-3">
          <div className="score-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Subtasks */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-[var(--muted)] uppercase tracking-wide">
          Subtasks ({completedCount}/{workActive.subtasks.length})
        </h4>
        <div className="space-y-2">
          {workActive.subtasks.map((task, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                task.done
                  ? "bg-[var(--success)]/10 border border-[var(--success)]/20"
                  : "bg-[var(--card-border)]/30"
              }`}
            >
              <span
                className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                  task.done
                    ? "bg-[var(--success)] text-white"
                    : "border border-[var(--muted)]"
                }`}
              >
                {task.done ? "✓" : ""}
              </span>
              <span className={task.done ? "line-through text-[var(--muted)]" : ""}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <h4 className="text-sm font-medium mb-3 text-[var(--muted)] uppercase tracking-wide">
          Notes
        </h4>
        <div className="p-4 bg-[var(--card-border)]/30 rounded-lg">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{workActive.notes}</p>
        </div>
      </div>
    </div>
  );
}
