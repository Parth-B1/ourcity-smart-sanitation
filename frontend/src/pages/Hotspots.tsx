import { useEffect, useState } from "react";
import { ArrowLeft, Layers, Loader2, MapPin, Route } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import CityMap from "../components/map/CityMap";

import {
  getHotspots,
  type Hotspot,
} from "../services/hotspotService";

function Hotspots() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const data = await getHotspots();
        setHotspots(data);
      } catch (err) {
        console.error("Hotspot loading error:", err);
        setError("Unable to load hotspot data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalReports = hotspots.reduce(
    (sum, h) => sum + h.report_count,
    0,
  );

  const highPriorityTotal = hotspots.reduce(
    (sum, h) => sum + h.high_priority_reports,
    0,
  );

  return (
    <div className="app">
      <Navbar />

      <main className="hotspots-page">
        <div className="hotspots-container">

          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div className="hotspots-header">
            <div>
              <span className="eyebrow">
                GEOSPATIAL INTELLIGENCE
              </span>

              <h1>Waste hotspots</h1>

              <p>
                See where sanitation problems are concentrated and how
                collection activity is moving across Nagpur.
              </p>
            </div>
          </div>

          <div className="map-controls">
            <div>
              <Layers size={16} />
              Hotspots
            </div>

            <div>
              <MapPin size={16} />
              Reports
            </div>

            <div>
              <Route size={16} />
              Collection route
            </div>
          </div>

          {error && (
            <div className="route-error">
              <strong>Data unavailable</strong>
              <span>{error}</span>
            </div>
          )}

          <div className="full-map-wrapper">
            {loading ? (
              <div className="route-loading" style={{ minHeight: 400 }}>
                <Loader2 className="spin" size={24} />
                <span>Loading hotspot map...</span>
              </div>
            ) : (
              <CityMap
                showHotspots={true}
                showReports={true}
                hotspots={hotspots}
              />
            )}
          </div>

          <div className="map-info">
            <div>
              <strong>{loading ? "..." : hotspots.length}</strong>
              <span>Active hotspots</span>
            </div>

            <div>
              <strong>{loading ? "..." : totalReports}</strong>
              <span>Total reports</span>
            </div>

            <div>
              <strong>{loading ? "..." : highPriorityTotal}</strong>
              <span>High priority</span>
            </div>

            <div>
              <strong>
                {loading
                  ? "..."
                  : hotspots.filter((h) => h.priority === "high").length}
              </strong>
              <span>Critical zones</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Hotspots;