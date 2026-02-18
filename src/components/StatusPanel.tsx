"use client";

interface StatusProps {
  status: {
    online: boolean;
    lastActive: string;
    currentTask: string;
    mode: string;
    uptime: string;
    sessionsToday: number;
    tokensUsed: number;
  };
}

export default function StatusPanel({ status }: StatusProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Status</h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              status.online ? "bg-[var(--success)] pulse" : "bg-[var(--error)]"
            }`}
          />
          <span className={status.online ? "status-online" : "status-offline"}>
            {status.online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs text-[var(--muted)] uppercase tracking-wide">Current Task</span>
          <p className="text-sm mt-1">{status.currentTask}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-[var(--muted)] uppercase tracking-wide">Mode</span>
            <p className="text-sm mt-1 capitalize">{status.mode}</p>
          </div>
          <div>
            <span className="text-xs text-[var(--muted)] uppercase tracking-wide">Uptime</span>
            <p className="text-sm mt-1">{status.uptime}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-[var(--muted)] uppercase tracking-wide">Sessions</span>
            <p className="text-sm mt-1">{status.sessionsToday} today</p>
          </div>
          <div>
            <span className="text-xs text-[var(--muted)] uppercase tracking-wide">Tokens</span>
            <p className="text-sm mt-1">{(status.tokensUsed / 1000).toFixed(1)}k</p>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--card-border)]">
          <span className="text-xs text-[var(--muted)]">
            Last active: {formatTime(status.lastActive)}
          </span>
        </div>
      </div>
    </div>
  );
}
