import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import HotspotLayer from "./HotspotLayer";
import ReportMarkers from "./ReportMarkers";
import RouteLayer from "./RouteLayer";

const nagpurCenter: [number, number] = [21.1458, 79.0882];

interface CityMapProps {
  showHotspots?: boolean;
  showReports?: boolean;
  showRoute?: boolean;
}

function CityMap({
  showHotspots = true,
  showReports = true,
  showRoute = true,
}: CityMapProps) {
  return (
    <MapContainer
      center={nagpurCenter}
      zoom={12}
      scrollWheelZoom
      className="city-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showHotspots && <HotspotLayer />}

      {showReports && <ReportMarkers />}

      {showRoute && <RouteLayer />}
    </MapContainer>
  );
}

export default CityMap;