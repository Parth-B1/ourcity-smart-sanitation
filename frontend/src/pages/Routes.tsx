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

const stops = [
  {
    number: 1,
    area: "Dharampeth",
    time: "4:10 PM",
    status: "completed",
  },
  {
    number: 2,
    area: "Civil Lines",
    time: "4:25 PM",
    status: "current",
  },
  {
    number: 3,
    area: "Sadar",
    time: "4:40 PM",
    status: "upcoming",
  },
  {
    number: 4,
    area: "Mahal",
    time: "5:00 PM",
    status: "upcoming",
  },
  {
    number: 5,
    area: "Manish Nagar",
    time: "5:25 PM",
    status: "upcoming",
  },
];

function Routes() {
  return (
    <div className="app">
      <Navbar />

      <main className="routes-page">
        <div className="routes-container">

          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

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
                  Route: <strong>Dharampeth → Sadar</strong>
                </p>
              </div>
            </div>

            <div className="route-stat">
              <Clock3 size={17} />
              <div>
                <span>Next stop</span>
                <strong>12 min</strong>
              </div>
            </div>

            <div className="route-stat">
              <MapPin size={17} />
              <div>
                <span>Stops remaining</span>
                <strong>4</strong>
              </div>
            </div>

            <div className="route-stat">
              <Navigation size={17} />
              <div>
                <span>Distance remaining</span>
                <strong>6.8 km</strong>
              </div>
            </div>

          </section>

          {/* Map */}

          <section className="route-map-panel">
            <div className="route-panel-header">
              <div>
                <h2>Live route</h2>
                <span>Truck 104 · Updated just now</span>
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
              />
            </div>
          </section>

          {/* Route details */}

          <section className="route-details-grid">

            {/* Stops */}

            <div className="route-stops-panel">

              <div className="route-panel-header">
                <div>
                  <h2>Upcoming collection</h2>
                  <span>Today's route schedule</span>
                </div>

                <RouteIcon size={18} />
              </div>

              <div className="stops-list">
                {stops.map((stop) => (
                  <div
                    key={stop.number}
                    className={`route-stop ${stop.status}`}
                  >
                    <div className="stop-number">
                      {stop.status === "completed" ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        stop.number
                      )}
                    </div>

                    <div className="stop-info">
                      <strong>{stop.area}</strong>

                      <span>
                        <MapPin size={11} />
                        Collection zone
                      </span>
                    </div>

                    <div className="stop-time">
                      <span>
                        {stop.status === "current"
                          ? "ETA"
                          : stop.status === "completed"
                            ? "Collected"
                            : "Expected"}
                      </span>

                      <strong>{stop.time}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route intelligence */}

            <div className="route-ai-panel">

              <div className="route-ai-icon">
                <Navigation size={20} />
              </div>

              <span>ROUTE INTELLIGENCE</span>

              <h2>
                Route optimized for current waste activity.
              </h2>

              <p>
                The collection route prioritizes areas with higher
                waste-report density while minimizing unnecessary
                travel between collection zones.
              </p>

              <div className="route-ai-stats">

                <div>
                  <strong>18%</strong>
                  <span>Distance saved</span>
                </div>

                <div>
                  <strong>23 min</strong>
                  <span>Estimated time saved</span>
                </div>

                <div>
                  <strong>12</strong>
                  <span>Priority reports covered</span>
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
              <span>CITIZEN NOTIFICATION</span>

              <h2>
                Garbage collection is coming to your area.
              </h2>

              <p>
                Residents near Civil Lines will receive an alert
                approximately 15 minutes before Truck 104 arrives.
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