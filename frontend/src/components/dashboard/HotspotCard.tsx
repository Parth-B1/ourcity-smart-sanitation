import {
  AlertTriangle,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

interface HotspotCardProps {
  name: string;
  reports: number;
  priority: "High" | "Medium" | "Low";
  trend: string;
}

function HotspotCard({
  name,
  reports,
  priority,
  trend,
}: HotspotCardProps) {
  return (
    <div className="hotspot-card">
      <div className="hotspot-card-header">
        <div className="hotspot-location">
          <div className="hotspot-pin">
            <MapPin size={16} />
          </div>

          <div>
            <strong>{name}</strong>
            <span>{reports} reports this week</span>
          </div>
        </div>

        <div
          className={`hotspot-priority priority-${priority.toLowerCase()}`}
        >
          <AlertTriangle size={12} />
          {priority}
        </div>
      </div>

      <div className="hotspot-card-footer">
        <span>{trend}</span>

        <button type="button">
          View area
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default HotspotCard;