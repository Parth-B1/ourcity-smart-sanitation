import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import ReportCard from "../components/citizen/ReportCard";

import {
  getReports,
  type ReportResponse,
} from "../services/reportService";

function MyReports() {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const data = await getReports();
        setReports(data);
      } catch (err) {
        console.error("Reports loading error:", err);
        setError("Unable to load reports.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute overview from real data
  const totalCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const inProgressCount = totalCount - resolvedCount;
  const highPriorityCount = reports.filter(
    (r) => r.priority === "high" || r.priority === "critical",
  ).length;

  // Map backend reports to the format ReportCard expects
  const displayReports = reports.map((r) => {
    const priority =
      r.priority === "critical" || r.priority === "high"
        ? "High"
        : r.priority === "medium"
          ? "Medium"
          : "Low";

    const status = (
      r.status === "resolved"
        ? "resolved"
        : r.status === "assigned"
          ? "assigned"
          : r.status === "reviewing"
            ? "reviewing"
            : "submitted"
    ) as "submitted" | "reviewing" | "assigned" | "resolved";

    return {
      id: r.report_code,
      category: r.ai_category || r.category,
      location: r.location,
      date: formatDate(r.created_at),
      status,
      priority: priority as "Low" | "Medium" | "High",
      description: r.description || r.ai_reasoning || "No description provided.",
    };
  });

  return (
    <div className="app">
      <Navbar />

      <main className="my-reports-page">
        <div className="my-reports-container">
          <div className="my-reports-header">
            <div>
              <span className="eyebrow">CITIZEN PORTAL</span>

              <h1>My Reports</h1>

              <p>
                Track sanitation issues you've reported and see how the city
                is responding.
              </p>
            </div>

            <Link to="/report" className="new-report-button">
              <Plus size={18} />
              New report
            </Link>
          </div>

          {/* Error */}

          {error && (
            <div className="route-error">
              <strong>Data unavailable</strong>
              <span>{error}</span>
            </div>
          )}

          {/* Overview */}
          <section className="report-overview">
            <div className="overview-card">
              <div className="overview-icon blue">
                <FileText size={19} />
              </div>

              <div>
                <strong>{loading ? "..." : totalCount}</strong>
                <span>Total reports</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon orange">
                <Clock3 size={19} />
              </div>

              <div>
                <strong>{loading ? "..." : inProgressCount}</strong>
                <span>In progress</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon green">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <strong>{loading ? "..." : resolvedCount}</strong>
                <span>Resolved</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon red">
                <AlertCircle size={19} />
              </div>

              <div>
                <strong>{loading ? "..." : highPriorityCount}</strong>
                <span>High priority</span>
              </div>
            </div>
          </section>

          {/* Reports */}
          <section className="reports-list-section">
            <div className="reports-list-header">
              <div>
                <h2>Recent reports</h2>
                <span>Latest activity from your submissions</span>
              </div>

              <select defaultValue="recent">
                <option value="recent">Most recent</option>
                <option value="active">Active only</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="reports-list">
              {loading ? (
                <div className="route-loading">
                  <Loader2 className="spin" size={24} />
                  <span>Loading reports...</span>
                </div>
              ) : displayReports.length === 0 ? (
                <div className="route-empty">
                  <CheckCircle2 size={22} />
                  <strong>No reports yet</strong>
                  <span>
                    Submit your first waste report to get started.
                  </span>
                </div>
              ) : (
                displayReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60);
    return `Today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default MyReports;