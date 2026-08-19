import { Link, NavLink } from "react-router-dom";
import { Bell, Menu, Recycle } from "lucide-react";
import { useState } from "react";
import { LogOut } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Report Waste", path: "/report" },
    { name: "My Reports", path: "/my-reports" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <Recycle size={22} />
          </div>

          <div>
            <span className="brand-name">OurCity</span>
            <span className="brand-subtitle">Smart Sanitation</span>
          </div>
        </Link>

        <nav className="desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <button className="notification-button" aria-label="Notifications">
            <Bell size={20} />
            <span className="notification-dot" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-link"
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
