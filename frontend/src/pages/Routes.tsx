import { useEffect, useState } from "react";
import {
  getHotspots,
  type Hotspot,
} from "../services/hotspotService";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import CityMap from "../components/map/CityMap";

import {
  getOptimizedRoute,
  type OptimizedRoute,
} from "../services/routeService";

function Routes() {
  const [route, setRoute] = useState<OptimizedRoute | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [routeData, hotspotData] =
          await Promise.all([
            getOptimizedRoute(
              21.1458,
              79.0882,
            ),
            getHotspots(),
          ]);

        setRoute(routeData);
        setHotspots(hotspotData);
      } catch (err) {
        console.error(
          "Collection intelligence loading error:",
          err,
        );

        setError(
          "Unable to load collection intelligence.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const firstStop = route?.stops[0];

  return (
    <div className="app">
      <Navbar />

      <main className="routes-page">
        <div className="routes-container">

          {/* Back */}

          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          {/* Header */}

          <div className="routes-header">
            <div>
              <span className="eyebrow">
                SMART COLLECTION NETWORK
              </span>

              <h1>Collection routes</h1>

              <p>
                Monitor active garbage vehicles, upcoming collection
                stops, and estimated arrival times.
              </p>
            </div>

            <div className="fleet-status">
              <span />
              Fleet operating normally
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="route-error">
              <strong>Route unavailable</strong>
              <span>{error}</span>
            </div>
          )}

          {/* Route overview */}

          <section className="route-overview">

            <div className="route-main-info">
              <div className="truck-large-icon">
                <Truck size={25} />
              </div>

              <div>
                <span>ACTIVE VEHICLE</span>

                <h2>Truck 104</h2>

                <p>
                  Route:{" "}
                  <strong>
                    Smart priority route
                  </strong>
                </p>
              </div>
            </div>

            {/* Next stop */}

            <div className="route-stat">
              <Clock3 size={17} />

              <div>
                <span>Next stop</span>

                <strong>
                  {loading
                    ? "..."
                    : firstStop
                      ? `${firstStop.travel_time_minutes} min`
                      : "—"}
                </strong>
              </div>
            </div>

            {/* Stops */}

            <div className="route-stat">
              <MapPin size={17} />

              <div>
                <span>Stops remaining</span>

                <strong>
                  {loading
                    ? "..."
                    : route?.stops.length ?? 0}
                </strong>
              </div>
            </div>

            {/* Distance */}

            <div className="route-stat">
              <Navigation size={17} />

              <div>
                <span>Total distance</span>

                <strong>
                  {loading
                    ? "..."
                    : `${route?.total_distance_km ?? 0} km`}
                </strong>
              </div>
            </div>

          </section>

          {/* Route map */}

          <section className="route-map-panel">

            <div className="route-panel-header">

              <div>
                <h2>Live route</h2>

                <span>
                  Truck 104 · Backend optimized route
                </span>
              </div>

              <div className="route-live">
                <span />
                LIVE
              </div>

            </div>

            <div className="route-map">
              <CityMap
                showHotspots={true}
                showReports={false}
                showRoute={true}
                routeCoordinates={route?.route_coordinates ?? []}
                hotspots={hotspots}
              />
            </div>

          </section>

          {/* Route details */}

          <section className="route-details-grid">

            {/* Collection stops */}

            <div className="route-stops-panel">

              <div className="route-panel-header">

                <div>
                  <h2>Collection stops</h2>

                  <span>
                    Generated from current waste hotspots
                  </span>
                </div>

                <RouteIcon size={18} />

              </div>

              {loading ? (
                <div className="route-loading">
                  <div className="route-loading-spinner" />

                  <span>
                    Calculating optimal route...
                  </span>
                </div>
              ) : route?.stops.length === 0 ? (
                <div className="route-empty">
                  <CheckCircle2 size={22} />

                  <strong>
                    No active collection stops
                  </strong>

                  <span>
                    There are currently no detected hotspots
                    requiring collection.
                  </span>
                </div>
              ) : (
                <div className="stops-list">

                  {route?.stops.map((stop) => (
                    <div
                      key={stop.stop_number}
                      className={`route-stop ${
                        stop.stop_number === 1
                          ? "current"
                          : ""
                      }`}
                    >

                      {/* Number */}

                      <div className="stop-number">

                        {stop.stop_number === 1 ? (
                          <Navigation size={13} />
                        ) : (
                          stop.stop_number
                        )}

                      </div>

                      {/* Information */}

                      <div className="stop-info">

                        <strong>
                          Collection Stop{" "}
                          {stop.stop_number}
                        </strong>

                        <span>
                          <MapPin size={11} />

                          {stop.report_count} reports
                          {" · "}
                          {stop.high_priority_reports} high
                          priority
                        </span>

                      </div>

                      {/* Time */}

                      <div className="stop-time">

                        <span>
                          {stop.stop_number === 1
                            ? "NEXT STOP"
                            : "TRAVEL"}
                        </span>

                        <strong>
                          {stop.travel_time_minutes} min
                        </strong>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* AI Route intelligence */}

            <div className="route-ai-panel">

              <div className="route-ai-icon">
                <Navigation size={20} />
              </div>

              <span>
                ROUTE INTELLIGENCE
              </span>

              <h2>
                Priority-aware collection route.
              </h2>

              <p>
                The backend analyzes current sanitation
                hotspots and prioritizes areas with greater
                waste-report density and higher-severity
                reports.
              </p>

              <div className="route-ai-stats">

                <div>
                  <strong>
                    {loading
                      ? "..."
                      : `${route?.total_distance_km ?? 0} km`}
                  </strong>

                  <span>
                    Total route distance
                  </span>
                </div>

                <div>
                  <strong>
                    {loading
                      ? "..."
                      : `${route?.estimated_time_minutes ?? 0} min`}
                  </strong>

                  <span>
                    Estimated travel time
                  </span>
                </div>

                <div>
                  <strong>
                    {loading
                      ? "..."
                      : route?.stops.reduce(
                          (
                            total,
                            stop,
                          ) =>
                            total +
                            stop.high_priority_reports,
                          0,
                        ) ?? 0}
                  </strong>

                  <span>
                    High priority reports
                  </span>
                </div>

              </div>

            </div>

          </section>

          {/* Citizen alert */}

          <section className="collection-alert-preview">

            <div className="alert-truck-icon">
              <Truck size={22} />
            </div>

            <div>

              <span>
                CITIZEN NOTIFICATION
              </span>

              <h2>
                Garbage collection is coming to your area.
              </h2>

              <p>
                Residents near the next collection hotspot
                can receive an alert before Truck 104 arrives.
              </p>

            </div>

            <button type="button">
              Preview notification
            </button>

          </section>

        </div>
      </main>
    </div>
  );
}

export default Routes;