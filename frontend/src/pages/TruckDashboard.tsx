import {
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

import CityMap from "../components/map/CityMap";
import {
  getOptimizedRoute,
  type OptimizedRoute,
} from "../services/routeService";
import { getStoredUser } from "../services/authService";


function TruckDashboard() {
  const user = getStoredUser();

  const [route, setRoute] =
    useState<OptimizedRoute | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadRoute() {
      try {
        setLoading(true);
        setError("");

        // Current demo truck location in Nagpur.
        // Later this can come from live GPS.
        const latitude = 21.1458;
        const longitude = 79.0882;

        const data =
          await getOptimizedRoute(
            latitude,
            longitude,
          );

        setRoute(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load the assigned route.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadRoute();
  }, []);


  const nextStop =
    route?.stops?.[0] ?? null;


  return (
    <div className="truck-dashboard">

      {/* Header */}

      <header className="truck-header">

        <div>
          <div className="truck-title">
            <Truck size={22} />

            <span>
              Truck{" "}
              {user?.truck_id ?? "104"}
            </span>
          </div>

          <p>
            Garbage collection operator
          </p>
        </div>

        <div className="truck-status">
          <span className="status-dot" />
          ON DUTY
        </div>

      </header>


      {/* Main */}

      <main className="truck-content">

        {/* Route summary */}

        <section className="truck-summary">

          <div className="truck-summary-card">
            <span>
              Total route
            </span>

            <strong>
              {route
                ? `${route.total_distance_km} km`
                : "--"}
            </strong>
          </div>


          <div className="truck-summary-card">
            <span>
              Estimated time
            </span>

            <strong>
              {route
                ? `${route.estimated_time_minutes} min`
                : "--"}
            </strong>
          </div>


          <div className="truck-summary-card">
            <span>
              Collection stops
            </span>

            <strong>
              {route
                ? route.stops.length
                : "--"}
            </strong>
          </div>

        </section>


        {/* Route map */}

        <section className="truck-map-card">

          <div className="truck-section-header">

            <div>
              <h2>
                Assigned route
              </h2>

              <p>
                AI-optimized collection route
              </p>
            </div>

            <Navigation size={20} />

          </div>


          <div className="truck-map">

            {loading && (
              <div className="truck-map-overlay">
                Loading route...
              </div>
            )}

            {error && (
              <div className="truck-map-overlay">
                {error}
              </div>
            )}

            <CityMap
              showHotspots={false}
              showReports={false}
              showRoute={Boolean(
                route?.route_coordinates &&
                route.route_coordinates.length > 1,
              )}
              routeCoordinates={
                route?.route_coordinates ?? []
              }
            />

          </div>

        </section>


        {/* Next collection */}

        <section className="next-stop-card">

          <div className="truck-section-header">

            <div>
              <h2>
                Next collection
              </h2>

              <p>
                Highest-priority stop
              </p>
            </div>

            <MapPin size={20} />

          </div>


          {nextStop ? (
            <>
              <div className="next-stop-main">

                <div
                  className={`priority-indicator priority-${nextStop.priority.toLowerCase()}`}
                >
                  {nextStop.priority}
                </div>

                <div>

                  <h3>
                    Hotspot #{nextStop.stop_number}
                  </h3>

                  <p>
                    {nextStop.report_count} reports
                    {" · "}
                    {nextStop.high_priority_reports}
                    {" "}
                    high priority
                  </p>

                </div>

              </div>


              <div className="next-stop-meta">

                <div>
                  <MapPin size={16} />

                  <span>
                    {
                      nextStop.distance_from_previous_km
                    }{" "}
                    km
                  </span>
                </div>


                <div>
                  <Clock3 size={16} />

                  <span>
                    {
                      nextStop.travel_time_minutes
                    }{" "}
                    min
                  </span>
                </div>

              </div>


              <div className="truck-actions">

                <button
                  type="button"
                  className="start-route-button"
                >
                  <Navigation size={17} />
                  Start navigation
                </button>


                <button
                  type="button"
                  className="complete-button"
                >
                  <CheckCircle2 size={17} />
                  Mark collected
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


        {/* Full route stop list */}

        {route &&
          route.stops.length > 0 && (

            <section className="route-stops-card">

              <div className="truck-section-header">

                <div>
                  <h2>
                    Collection route
                  </h2>

                  <p>
                    Follow the optimized stop order
                  </p>
                </div>

              </div>


              <div className="route-stop-list">

                {route.stops.map((stop) => (

                  <div
                    key={stop.stop_number}
                    className="route-stop"
                  >

                    <div className="route-stop-number">
                      {stop.stop_number}
                    </div>


                    <div className="route-stop-info">

                      <strong>
                        Hotspot #{stop.stop_number}
                      </strong>

                      <span>
                        {stop.report_count} reports
                        {" · "}
                        {stop.priority} priority
                      </span>

                    </div>


                    <div className="route-stop-distance">

                      {
                        stop.distance_from_previous_km
                      }{" "}
                      km

                    </div>

                  </div>

                ))}

              </div>

            </section>

          )}

      </main>

    </div>
  );
}

export default TruckDashboard;