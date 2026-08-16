import {
  ArrowRight,
  Camera,
  Clock3,
  MapPin,
  Recycle,
  Truck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";

function Home() {
  return (
    <div className="app">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={15} />
              AI-powered municipal sanitation
            </div>

            <h1>
              A cleaner city,
              <span> powered by intelligence.</span>
            </h1>

            <p className="hero-description">
              Report waste, track sanitation issues, and know when your
              garbage collection vehicle is coming to your neighborhood.
            </p>

            <div className="hero-actions">
              <Link to="/report" className="hero-primary">
                <Camera size={19} />
                Report Waste
                <ArrowRight size={18} />
              </Link>

              <Link to="/my-reports" className="hero-secondary">
                Track My Reports
              </Link>
            </div>

            <div className="hero-location">
              <MapPin size={17} />
              <span>Your city</span>
              <strong>•</strong>
              <span>Smart sanitation network</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              <Recycle size={120} strokeWidth={1.2} />
            </div>

            <div className="floating-card collection-mini-card">
              <div className="mini-icon">
                <Truck size={19} />
              </div>

              <div>
                <small>Next collection</small>
                <strong>Today · 4:30 PM</strong>
              </div>
            </div>

            <div className="floating-card ai-mini-card">
              <div className="ai-dot" />
              <div>
                <small>AI Status</small>
                <strong>System operational</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Alert */}
        <section className="collection-section">
          <div className="collection-card">
            <div className="collection-icon">
              <Truck size={28} />
            </div>

            <div className="collection-info">
              <div className="section-label">
                <span className="live-dot" />
                COLLECTION ALERT
              </div>

              <h2>Your garbage collection is coming.</h2>

              <p>
                The next sanitation vehicle is expected in your area today.
              </p>
            </div>

            <div className="collection-time">
              <Clock3 size={18} />
              <div>
                <span>Expected arrival</span>
                <strong>4:30 PM</strong>
              </div>
            </div>

            <Link to="/routes" className="collection-link">
              View route
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CITIZEN SERVICES</span>
              <h2>What would you like to do?</h2>
            </div>
          </div>

          <div className="action-grid">
            <Link to="/report" className="action-card">
              <div className="action-icon report-icon">
                <Camera size={24} />
              </div>

              <div>
                <h3>Report Waste</h3>
                <p>
                  Submit a photo and location. Our AI helps classify the issue.
                </p>
              </div>

              <ArrowRight size={20} className="action-arrow" />
            </Link>

            <Link to="/my-reports" className="action-card">
              <div className="action-icon track-icon">
                <MapPin size={24} />
              </div>

              <div>
                <h3>Track Reports</h3>
                <p>
                  See the status of your sanitation complaints in one place.
                </p>
              </div>

              <ArrowRight size={20} className="action-arrow" />
            </Link>

            <Link to="/routes" className="action-card">
              <div className="action-icon route-icon">
                <Truck size={24} />
              </div>

              <div>
                <h3>Collection Routes</h3>
                <p>
                  See upcoming garbage collection activity around the city.
                </p>
              </div>

              <ArrowRight size={20} className="action-arrow" />
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stat">
            <strong>1,284</strong>
            <span>Reports processed</span>
          </div>

          <div className="stat">
            <strong>42</strong>
            <span>Waste hotspots</span>
          </div>

          <div className="stat">
            <strong>18</strong>
            <span>Active vehicles</span>
          </div>

          <div className="stat">
            <strong>94%</strong>
            <span>Reports resolved</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;