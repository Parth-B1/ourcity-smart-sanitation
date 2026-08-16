import { ArrowLeft, Layers, MapPin, Route } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import CityMap from "../components/map/CityMap";

function Hotspots() {
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

          <div className="full-map-wrapper">
            <CityMap />
          </div>

          <div className="map-info">
            <div>
              <strong>42</strong>
              <span>Active hotspots</span>
            </div>

            <div>
              <strong>126</strong>
              <span>Pending reports</span>
            </div>

            <div>
              <strong>18</strong>
              <span>Vehicles active</span>
            </div>

            <div>
              <strong>94%</strong>
              <span>Resolution rate</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Hotspots;