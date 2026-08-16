import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";

export type ReportStatus =
  | "submitted"
  | "reviewing"
  | "assigned"
  | "resolved";

interface Report {
  id: string;
  category: string;
  location: string;
  date: string;
  status: ReportStatus;
  priority: "Low" | "Medium" | "High";
  description: string;
}

interface ReportCardProps {
  report: Report;
}

const statusConfig = {
  submitted: {
    label: "Submitted",
    color: "blue",
  },
  reviewing: {
    label: "Under review",
    color: "orange",
  },
  assigned: {
    label: "Team assigned",
    color: "purple",
  },
  resolved: {
    label: "Resolved",
    color: "green",
  },
};

function ReportCard({ report }: ReportCardProps) {
  const status = statusConfig[report.status];

  return (
    <article className="report-card">
      <div className="report-card-top">
        <div>
          <div className="report-id">
            <span>REPORT</span>
            {report.id}
          </div>

          <h3>{report.category}</h3>
        </div>

        <div className={`status-badge ${status.color}`}>
          {report.status === "resolved" ? (
            <CheckCircle2 size={13} />
          ) : (
            <Clock3 size={13} />
          )}

          {status.label}
        </div>
      </div>

      <p className="report-description">{report.description}</p>

      <div className="report-meta">
        <div>
          <MapPin size={14} />
          <span>{report.location}</span>
        </div>

        <div>
          <CalendarDays size={14} />
          <span>{report.date}</span>
        </div>
      </div>

      <div className="report-card-footer">
        <div className={`priority priority-${report.priority.toLowerCase()}`}>
          <Sparkles size={13} />
          AI Priority: {report.priority}
        </div>

        <button className="view-report-button">
          View details
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

export default ReportCard;