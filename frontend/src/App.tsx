import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";
import Dashboard from "./pages/Dashboard";
import Hotspots from "./pages/Hotspots";
import RoutesPage from "./pages/Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hotspots" element={<Hotspots />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;