import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  variant?: "green" | "orange" | "red" | "blue";
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  variant = "green",
}: StatCardProps) {
  return (
    <div className="dashboard-stat-card">
      <div className={`dashboard-stat-icon ${variant}`}>
        <Icon size={20} />
      </div>

      <div className="dashboard-stat-content">
        <span>{label}</span>

        <strong>{value}</strong>

        <small>{change}</small>
      </div>
    </div>
  );
}

export default StatCard;