import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock3,
  Loader2,
  Map,
  RefreshCw,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import StatCard from "../components/dashboard/StatCard";
import HotspotCard from "../components/dashboard/HotspotCard";
import TruckCard from "../components/dashboard/TruckCard";
import ReportTable from "../components/dashboard/ReportTable";
import CityMap from "../components/map/CityMap";

import { getReports, type ReportResponse } from "../services/reportService";

import { getHotspots, type Hotspot } from "../services/hotspotService";

function Dashboard() {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reportData, hotspotData] = await Promise.all([
        getReports(),
        getHotspots(),
      ]);

      setReports(reportData);
      setHotspots(hotspotData);
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -----------------------------------------------
  // Statistics
  // -----------------------------------------------

  const totalReports = reports.length;

  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;

  const pendingReports = reports.filter(
    (report) => report.status !== "resolved",
  );

  const highPriorityPending = pendingReports.filter(
    (report) => report.priority === "high" || report.priority === "critical",
  ).length;
  // -----------------------------------------------
  // Report table
  // -----------------------------------------------

  const tableReports = reports.slice(0, 5).map((report) => {
    const age = getReportAge(report.created_at);

    const formattedPriority =
      report.priority.charAt(0).toUpperCase() + report.priority.slice(1);

    return {
      id: report.report_code,
      location: report.location,
      category: report.category,
      priority: (formattedPriority === "Critical"
        ? "High"
        : formattedPriority) as "High" | "Medium" | "Low",
      age,
    };
  });

  // -----------------------------------------------
  // Hotspot cards
  // -----------------------------------------------

  const topHotspots = hotspots.slice(0, 4).map((hotspot, index) => {
    const priority =
      hotspot.priority === "high" || hotspot.priority === "critical"
        ? "High"
        : hotspot.priority === "medium"
          ? "Medium"
          : "Low";

    return {
      name: `Hotspot ${index + 1}`,
      reports: hotspot.report_count,
      priority: priority as "High" | "Medium" | "Low",
      trend: `${hotspot.high_priority_reports} high priority`,
      coords: `${hotspot.latitude.toFixed(4)}, ${hotspot.longitude.toFixed(4)}`,
    };
  });

  // -----------------------------------------------
  // Dashboard
  // -----------------------------------------------

  return (
    <div className="app dashboard-app">
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-container">
          {/* Header */}

          <div className="dashboard-header">
            <div>
              <div className="dashboard-live">
                <span />
                LIVE MUNICIPAL INTELLIGENCE
              </div>

              <h1>City sanitation overview</h1>

              <p>
                Monitor reports, identify waste hotspots, and coordinate
                collection activity across the city.
              </p>
            </div>

            <button className="refresh-button" onClick={loadData} type="button">
              <RefreshCw size={15} />
              Refresh data
            </button>
          </div>

          {/* Error */}

          {error && (
            <div className="route-error">
              <strong>Data unavailable</strong>

              <span>{error}</span>
            </div>
          )}

          {/* Stats */}

          <section className="dashboard-stats">
            <StatCard
              label="Total reports"
              value={loading ? "..." : String(totalReports)}
              change={
                loading ? "Loading..." : `${pendingReports.length} pending`
              }
              icon={BarChart3}
              variant="green"
            />

            <StatCard
              label="Pending reports"
              value={loading ? "..." : String(pendingReports.length)}
              change={
                loading ? "Loading..." : `${highPriorityPending} high priority`
              }
              icon={Clock3}
              variant="orange"
            />

            <StatCard
              label="Waste hotspots"
              value={loading ? "..." : String(hotspots.length)}
              change={
                loading
                  ? "Loading..."
                  : `${
                      hotspots.filter(
                        (hotspot) =>
                          hotspot.priority === "high" ||
                          hotspot.priority === "critical",
                      ).length
                    } high priority`
              }
              icon={AlertTriangle}
              variant="red"
            />

            <StatCard
              label="Resolved reports"
              value={loading ? "..." : String(resolvedReports)}
              change={
                loading
                  ? "Loading..."
                  : totalReports > 0
                    ? `${Math.round(
                        (resolvedReports / totalReports) * 100,
                      )}% resolution rate`
                    : "No reports yet"
              }
              icon={CheckCircle2}
              variant="blue"
            />
          </section>

          {/* AI Insight */}

          <section className="ai-insight">
            <div className="ai-insight-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <span>AI SANITATION INSIGHT</span>

              <h2>
                {hotspots.length > 0
                  ? `${hotspots.length} waste hotspot${
                      hotspots.length !== 1 ? "s" : ""
                    } detected across the city.`
                  : "No active waste hotspots detected. The city is clean."}
              </h2>

              <p>
                Based on recent reports, historical patterns, and current
                collection activity, these areas may require additional
                collection capacity.
              </p>
            </div>

            <Link to="/hotspots">
              <button type="button">View analysis</button>
            </Link>
          </section>

          {/* Main grid */}

          <section className="dashboard-main-grid">
            {/* REAL MAP */}

            <div className="dashboard-panel map-panel">
              <div className="panel-header">
                <div>
                  <h2>Waste hotspots</h2>

                  <span>Live activity across monitored areas</span>
                </div>

                <Link to="/hotspots">
                  <button type="button">
                    <Map size={15} />
                    Full map
                  </button>
                </Link>
              </div>

              <div className="dashboard-map">
                <CityMap
                  showHotspots={true}
                  showReports={true}
                  showRoute={false}
                  hotspots={hotspots}
                />
              </div>

              <div className="map-legend">
                <span>
                  <i className="legend-high" />
                  High
                </span>

                <span>
                  <i className="legend-medium" />
                  Medium
                </span>

                <span>
                  <i className="legend-low" />
                  Low
                </span>
              </div>
            </div>

            {/* Hotspots */}

            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Top hotspots</h2>

                  <span>Areas needing attention</span>
                </div>
              </div>

              <div className="hotspot-list">
                {loading ? (
                  <div className="route-loading">
                    <Loader2 className="spin" size={20} />

                    <span>Loading hotspots...</span>
                  </div>
                ) : topHotspots.length === 0 ? (
                  <div className="route-empty">
                    <CheckCircle2 size={22} />

                    <strong>No active hotspots</strong>

                    <span>All areas are clean.</span>
                  </div>
                ) : (
                  topHotspots.map((hotspot, index) => (
                    <HotspotCard
                      key={index}
                      name={hotspot.name}
                      reports={hotspot.reports}
                      priority={hotspot.priority}
                      trend={hotspot.trend}
                    />
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Reports + Trucks */}

          <section className="dashboard-bottom-grid">
            <div className="dashboard-panel reports-panel">
              <div className="panel-header">
                <div>
                  <h2>Priority reports</h2>

                  <span>Reports requiring municipal attention</span>
                </div>

                <Link to="/my-reports">
                  <button type="button">View all</button>
                </Link>
              </div>

              {loading ? (
                <div className="route-loading">
                  <Loader2 className="spin" size={20} />

                  <span>Loading reports...</span>
                </div>
              ) : tableReports.length === 0 ? (
                <div className="route-empty">
                  <CheckCircle2 size={22} />

                  <strong>No reports yet</strong>

                  <span>Submit a report to get started.</span>
                </div>
              ) : (
                <ReportTable reports={tableReports} />
              )}
            </div>

            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Collection fleet</h2>

                  <span>Current vehicle activity</span>
                </div>

                <Truck size={18} />
              </div>

              <div className="truck-list">
                <TruckCard
                  id="Truck 104"
                  area="Dharampeth"
                  status="Active"
                  eta="12 min"
                />

                <TruckCard
                  id="Truck 217"
                  area="Sadar"
                  status="On route"
                  eta="18 min"
                />

                <TruckCard
                  id="Truck 083"
                  area="Civil Lines"
                  status="Active"
                  eta="26 min"
                />

                <TruckCard
                  id="Truck 091"
                  area="Manish Nagar"
                  status="Idle"
                  eta="—"
                />
              </div>
            </div>
          </section>

          {/* Bottom summary */}

          <section className="dashboard-summary">
            <div>
              <CheckCircle2 size={18} />

              <div>
                <strong>
                  {loading
                    ? "..."
                    : totalReports > 0
                      ? `${Math.round((resolvedReports / totalReports) * 100)}%`
                      : "—"}
                </strong>

                <span>Resolution rate</span>
              </div>
            </div>

            <div>
              <Clock3 size={18} />

              <div>
                <strong>3.2 hrs</strong>

                <span>Average response time</span>
              </div>
            </div>

            <div>
              <Bell size={18} />

              <div>
                <strong>{loading ? "..." : hotspots.length}</strong>

                <span>Active hotspots</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function getReportAge(createdAt: string): string {
  const now = new Date();

  const created = new Date(createdAt);

  const diffMs = now.getTime() - created.getTime();

  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)} hr`;
  }

  return `${Math.floor(diffMinutes / 1440)} days`;
}

export default Dashboard;
