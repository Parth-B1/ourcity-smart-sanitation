import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock3,
  Map,
  RefreshCw,
  Sparkles,
  Truck,
} from "lucide-react";

import Navbar from "../components/common/Navbar";
import StatCard from "../components/dashboard/StatCard";
import HotspotCard from "../components/dashboard/HotspotCard";
import TruckCard from "../components/dashboard/TruckCard";
import ReportTable from "../components/dashboard/ReportTable";

const reports = [
  {
    id: "OS-00842",
    location: "Dharampeth",
    category: "Mixed waste",
    priority: "High" as const,
    age: "18 min",
  },
  {
    id: "OS-00841",
    location: "Sadar",
    category: "Overflowing bin",
    priority: "High" as const,
    age: "42 min",
  },
  {
    id: "OS-00839",
    location: "Civil Lines",
    category: "Plastic waste",
    priority: "Medium" as const,
    age: "1 hr",
  },
  {
    id: "OS-00836",
    location: "Manish Nagar",
    category: "Illegal dumping",
    priority: "Medium" as const,
    age: "2 hrs",
  },
];

function Dashboard() {
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

            <button className="refresh-button">
              <RefreshCw size={15} />
              Refresh data
            </button>
          </div>

          {/* Stats */}

          <section className="dashboard-stats">
            <StatCard
              label="Total reports"
              value="1,284"
              change="+12% this week"
              icon={BarChart3}
              variant="green"
            />

            <StatCard
              label="Pending reports"
              value="126"
              change="18 high priority"
              icon={Clock3}
              variant="orange"
            />

            <StatCard
              label="Waste hotspots"
              value="42"
              change="+4 identified"
              icon={AlertTriangle}
              variant="red"
            />

            <StatCard
              label="Active vehicles"
              value="18"
              change="92% fleet active"
              icon={Truck}
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
                Dharampeth and Sadar are showing unusually high waste
                activity today.
              </h2>

              <p>
                Based on recent reports, historical patterns, and current
                collection activity, these areas may require additional
                collection capacity.
              </p>
            </div>

            <button>
              View analysis
            </button>
          </section>

          {/* Main grid */}

          <section className="dashboard-main-grid">

            {/* Map */}

            <div className="dashboard-panel map-panel">
              <div className="panel-header">
                <div>
                  <h2>Waste hotspots</h2>
                  <span>Live activity across monitored areas</span>
                </div>

                <button>
                  <Map size={15} />
                  Full map
                </button>
              </div>

              <div className="fake-map">
                <div className="map-road road-one" />
                <div className="map-road road-two" />
                <div className="map-road road-three" />
                <div className="map-road road-four" />

                <div className="map-label label-one">
                  Dharampeth
                </div>

                <div className="map-label label-two">
                  Sadar
                </div>

                <div className="map-label label-three">
                  Civil Lines
                </div>

                <div className="map-label label-four">
                  Manish Nagar
                </div>

                <span className="hotspot-dot high dot-one" />
                <span className="hotspot-dot high dot-two" />
                <span className="hotspot-dot medium dot-three" />
                <span className="hotspot-dot medium dot-four" />
                <span className="hotspot-dot low dot-five" />
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
                <HotspotCard
                  name="Dharampeth"
                  reports={38}
                  priority="High"
                  trend="+24% activity"
                />

                <HotspotCard
                  name="Sadar"
                  reports={31}
                  priority="High"
                  trend="+17% activity"
                />

                <HotspotCard
                  name="Civil Lines"
                  reports={22}
                  priority="Medium"
                  trend="+9% activity"
                />

                <HotspotCard
                  name="Manish Nagar"
                  reports={16}
                  priority="Medium"
                  trend="+5% activity"
                />
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

                <button>
                  View all
                </button>
              </div>

              <ReportTable reports={reports} />
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
                <strong>94%</strong>
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
                <strong>284</strong>
                <span>Citizen alerts sent today</span>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;