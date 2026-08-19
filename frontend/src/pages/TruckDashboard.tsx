import { CheckCircle2, Clock3, MapPin, Navigation, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar  from "../components/common/Navbar";

import CityMap from "../components/map/CityMap";
import { getStoredUser } from "../services/authService";
import {
  completeCollection,
  getOptimizedRoute,
  type OptimizedRoute,
} from "../services/routeService";

function TruckDashboard() {
  const user = getStoredUser();

  const [route, setRoute] = useState<OptimizedRoute | null>(null);

  const [loading, setLoading] = useState(true);

  const [completing, setCompleting] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /*
   * Current demo truck location.
   *
   * Later this can be replaced with
   * live GPS location.
   */
  const truckLatitude = 21.1458;
  const truckLongitude = 79.0882;

  // --------------------------------------------------
  // Load optimized route
  // --------------------------------------------------

  async function loadRoute() {
    try {
      setLoading(true);
      setError("");

      const data = await getOptimizedRoute(truckLatitude, truckLongitude);

      setRoute(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the assigned route.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchRoute() {
      try {
        setLoading(true);
        setError("");

        const data = await getOptimizedRoute(truckLatitude, truckLongitude);

        setRoute(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the assigned route.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRoute();
  }, []);

  // --------------------------------------------------
  // Current next stop
  // --------------------------------------------------

  const nextStop = route?.stops?.[0] ?? null;

  // --------------------------------------------------
  // Mark collection complete
  // --------------------------------------------------

  async function handleCompleteCollection() {
    if (!nextStop) {
      return;
    }

    try {
      setCompleting(true);
      setError("");
      setSuccessMessage("");

      await completeCollection(nextStop.latitude, nextStop.longitude);

      setSuccessMessage(
        `Hotspot #${nextStop.stop_number} collected successfully.`,
      );

      /*
       * Reload route after collection.
       *
       * The completed reports are now resolved,
       * so the hotspot should disappear from the
       * active hotspot list and route.
       */
      await loadRoute();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to complete collection.",
      );
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="truck-dashboard">
      <Navbar />
      {/* ==================================================
          HEADER
          ================================================== */}

      <header className="truck-header">
        <div>
          <div className="truck-title">
            <Truck size={22} />

            <span>Truck {user?.truck_id ?? "104"}</span>
          </div>

          <p>Garbage collection operator</p>
        </div>

        <div className="truck-status">
          <span className="status-dot" />
          ON DUTY
        </div>
      </header>

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <main className="truck-content">
        {/* ==================================================
            ROUTE SUMMARY
            ================================================== */}

        <section className="truck-summary">
          <div className="truck-summary-card">
            <span>Total route</span>

            <strong>{route ? `${route.total_distance_km} km` : "--"}</strong>
          </div>

          <div className="truck-summary-card">
            <span>Estimated time</span>

            <strong>
              {route ? `${route.estimated_time_minutes} min` : "--"}
            </strong>
          </div>

          <div className="truck-summary-card">
            <span>Collection stops</span>

            <strong>{route ? route.stops.length : "--"}</strong>
          </div>
        </section>

        {/* ==================================================
            ROUTE MAP
            ================================================== */}

        <section className="truck-map-card">
          <div className="truck-section-header">
            <div>
              <h2>Assigned route</h2>

              <p>AI-optimized collection route</p>
            </div>

            <Navigation size={20} />
          </div>

          <div className="truck-map">
            {loading && (
              <div className="truck-map-overlay">Loading route...</div>
            )}

            {error && !loading && (
              <div className="truck-map-overlay">{error}</div>
            )}

            <CityMap
              showHotspots={false}
              showReports={false}
              showRoute={Boolean(
                route?.route_coordinates && route.route_coordinates.length > 1,
              )}
              routeCoordinates={route?.route_coordinates ?? []}
            />
          </div>
        </section>

        {/* ==================================================
            NEXT COLLECTION
            ================================================== */}

        <section className="next-stop-card">
          <div className="truck-section-header">
            <div>
              <h2>Next collection</h2>

              <p>Highest-priority stop</p>
            </div>

            <MapPin size={20} />
          </div>

          {/* Success message */}

          {successMessage && (
            <div className="collection-success">
              <CheckCircle2 size={16} />

              <span>{successMessage}</span>
            </div>
          )}

          {/* Error message */}

          {error && !loading && <div className="login-error">{error}</div>}

          {nextStop ? (
            <>
              {/* Next hotspot */}

              <div className="next-stop-main">
                <div
                  className={`priority-indicator priority-${nextStop.priority.toLowerCase()}`}
                >
                  {nextStop.priority}
                </div>

                <div>
                  <h3>Hotspot #{nextStop.stop_number}</h3>

                  <p>
                    {nextStop.report_count} reports
                    {" · "}
                    {nextStop.high_priority_reports} high priority
                  </p>
                </div>
              </div>

              {/* Distance + ETA */}

              <div className="next-stop-meta">
                <div>
                  <MapPin size={16} />

                  <span>{nextStop.distance_from_previous_km} km</span>
                </div>

                <div>
                  <Clock3 size={16} />

                  <span>{nextStop.travel_time_minutes} min</span>
                </div>
              </div>

              {/* Actions */}

              <div className="truck-actions">
                <button
                  type="button"
                  className="start-route-button"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${nextStop.latitude},${nextStop.longitude}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                >
                  <Navigation size={17} />
                  Start navigation
                </button>

                <button
                  type="button"
                  className="complete-button"
                  onClick={handleCompleteCollection}
                  disabled={completing}
                >
                  <CheckCircle2 size={17} />

                  {completing ? "Updating..." : "Mark collected"}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-stop">
              {loading
                ? "Loading collection stops..."
                : "No collection stops assigned."}
            </div>
          )}
        </section>

        {/* ==================================================
            FULL ROUTE STOP LIST
            ================================================== */}

        {route && route.stops.length > 0 && (
          <section className="route-stops-card">
            <div className="truck-section-header">
              <div>
                <h2>Collection route</h2>

                <p>Follow the AI-optimized stop order</p>
              </div>

              <Navigation size={20} />
            </div>

            <div className="route-stop-list">
              {route.stops.map((stop) => {
                const isNext = stop.stop_number === 1;

                return (
                  <div
                    key={stop.stop_number}
                    className={`route-stop ${isNext ? "route-stop-next" : ""}`}
                  >
                    {/* Stop number */}

                    <div className="route-stop-number">{stop.stop_number}</div>

                    {/* Stop information */}

                    <div className="route-stop-info">
                      <strong>
                        {isNext
                          ? "NEXT COLLECTION"
                          : `Hotspot #${stop.stop_number}`}
                      </strong>

                      <span>
                        {stop.report_count} reports
                        {" · "}
                        {stop.high_priority_reports} high priority
                      </span>
                    </div>

                    {/* Priority */}

                    <div
                      className={`route-stop-priority priority-${stop.priority.toLowerCase()}`}
                    >
                      {stop.priority}
                    </div>

                    {/* Travel time */}

                    <div className="route-stop-distance">
                      {isNext ? (
                        <>{stop.travel_time_minutes} min</>
                      ) : (
                        <>{stop.distance_from_previous_km} km</>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default TruckDashboard;
