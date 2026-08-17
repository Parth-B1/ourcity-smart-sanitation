import {
  MapContainer,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import HotspotLayer from "./HotspotLayer";
import ReportMarkers from "./ReportMarkers";
import RouteLayer from "./RouteLayer";
import MapViewController from "./MapViewController";

interface Hotspot {
  latitude: number;
  longitude: number;
  report_count: number;
  high_priority_reports: number;
  priority: string;
}

interface Report {
  id: number;
  report_code: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  priority: string;
}

interface CityMapProps {
  showHotspots?: boolean;
  showReports?: boolean;
  showRoute?: boolean;
  routeCoordinates?: [number, number][];
  hotspots?: Hotspot[];
  reports?: Report[];
}

const nagpurCenter: [number, number] = [
  21.1458,
  79.0882,
];

function CityMap({
  showHotspots = true,
  showReports = true,
  showRoute = false,
  routeCoordinates = [],
  hotspots = [],
  reports = [],
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

      {showHotspots && <HotspotLayer hotspots={hotspots} />}

      {showReports && <ReportMarkers reports={reports} />}

      {showRoute && (
        <>
          <RouteLayer
            coordinates={routeCoordinates}
          />

          <MapViewController
            coordinates={routeCoordinates}
          />
        </>
      )}
    </MapContainer>
  );
}

export default CityMap;