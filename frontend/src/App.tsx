import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";
import Dashboard from "./pages/Dashboard";
import Hotspots from "./pages/Hotspots";
import RoutesPage from "./pages/Routes";
import TruckDashboard from "./pages/TruckDashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Citizen */}
        <Route
          path="/report"
          element={
            <ProtectedRoute
              allowedRoles={["citizen"]}
            >
              <Report />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute
              allowedRoles={["citizen"]}
            >
              <MyReports />
            </ProtectedRoute>
          }
        />


        {/* NMC */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["nmc_officer"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hotspots"
          element={
            <ProtectedRoute
              allowedRoles={["nmc_officer"]}
            >
              <Hotspots />
            </ProtectedRoute>
          }
        />
        <Route
  path="/truck"
  element={
    <ProtectedRoute
      allowedRoles={["truck_operator"]}
    >
      <TruckDashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/routes"
          element={
            <ProtectedRoute
              allowedRoles={["nmc_officer"]}
            >
              <RoutesPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;