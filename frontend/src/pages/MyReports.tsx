import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import ReportCard from "../components/citizen/ReportCard";

const reports = [
  {
    id: "OS-2026-00842",
    category: "Mixed household waste",
    location: "Dharampeth, Nagpur",
    date: "Today, 1:42 PM",
    status: "reviewing" as const,
    priority: "High" as const,
    description:
      "Large amount of mixed waste accumulated beside the residential collection point.",
  },
  {
    id: "OS-2026-00791",
    category: "Overflowing bin",
    location: "Civil Lines, Nagpur",
    date: "Aug 14, 2026",
    status: "assigned" as const,
    priority: "Medium" as const,
    description:
      "Public waste bin has been overflowing for approximately two days.",
  },
  {
    id: "OS-2026-00683",
    category: "Plastic waste",
    location: "Sadar, Nagpur",
    date: "Aug 10, 2026",
    status: "resolved" as const,
    priority: "Low" as const,
    description:
      "Plastic waste accumulation near the roadside has been cleared.",
  },
];

function MyReports() {
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

          {/* Overview */}
          <section className="report-overview">
            <div className="overview-card">
              <div className="overview-icon blue">
                <FileText size={19} />
              </div>

              <div>
                <strong>3</strong>
                <span>Total reports</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon orange">
                <Clock3 size={19} />
              </div>

              <div>
                <strong>2</strong>
                <span>In progress</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon green">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <strong>1</strong>
                <span>Resolved</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon red">
                <AlertCircle size={19} />
              </div>

              <div>
                <strong>1</strong>
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
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MyReports;