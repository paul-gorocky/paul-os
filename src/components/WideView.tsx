"use client";

interface Project {
  name: string;
  status: "healthy" | "warning" | "stale";
  lastActivity: string;
  description: string;
  progress: number;
}

export default function WideView() {
  // In a real implementation, this would come from an API
  const projects: Project[] = [
    {
      name: "PAUL-OS",
      status: "healthy",
      lastActivity: "Now",
      description: "AI dashboard for autonomous work tracking",
      progress: 75,
    },
    {
      name: "Trading System",
      status: "healthy",
      lastActivity: "2h ago",
      description: "Crypto trading strategies and analysis",
      progress: 60,
    },
    {
      name: "GoRocky",
      status: "warning",
      lastActivity: "1d ago",
      description: "Business operations and automation",
      progress: 45,
    },
    {
      name: "GR Health",
      status: "stale",
      lastActivity: "3d ago",
      description: "Health tracking application",
      progress: 30,
    },
    {
      name: "Memory System",
      status: "healthy",
      lastActivity: "4h ago",
      description: "Long-term context management",
      progress: 80,
    },
    {
      name: "Scripts",
      status: "healthy",
      lastActivity: "1d ago",
      description: "Utility scripts and automation",
      progress: 90,
    },
  ];

  const statusColors = {
    healthy: "bg-[var(--success)]",
    warning: "bg-[var(--warning)]",
    stale: "bg-[var(--muted)]",
  };

  const statusBorders = {
    healthy: "border-[var(--success)]/30",
    warning: "border-[var(--warning)]/30",
    stale: "border-[var(--card-border)]",
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">All Projects</h2>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" /> Healthy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--warning)]" /> Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--muted)]" /> Stale
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.name}
            className={`p-4 rounded-lg border ${statusBorders[project.status]} bg-[var(--card-border)]/20 hover:bg-[var(--card-border)]/40 transition cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{project.name}</h3>
              <span className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
            </div>
            <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">
              {project.description}
            </p>
            
            {/* Progress bar */}
            <div className="score-bar mb-2">
              <div
                className="score-fill"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{project.progress}%</span>
              <span>{project.lastActivity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
