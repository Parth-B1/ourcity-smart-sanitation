import { CircleMarker, Popup } from "react-leaflet";

import type { Hotspot } from "../../services/hotspotService";

interface HotspotLayerProps {
  hotspots: Hotspot[];
}

function getHotspotColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
    case "critical":
      return "#dc4f3d";

    case "medium":
      return "#e2a03d";

    case "low":
    default:
      return "#52a46f";
  }
}

function getHotspotRadius(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
    case "critical":
      return 14;

    case "medium":
      return 11;

    case "low":
    default:
      return 9;
  }
}

function HotspotLayer({
  hotspots,
}: HotspotLayerProps) {
  return (
    <>
      {hotspots.map((hotspot, index) => {
        const color = getHotspotColor(
          hotspot.priority,
        );

        const radius = getHotspotRadius(
          hotspot.priority,
        );

        return (
          <CircleMarker
            key={`${hotspot.latitude}-${hotspot.longitude}-${index}`}
            center={[
              hotspot.latitude,
              hotspot.longitude,
            ]}
            radius={radius}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: color,
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <div className="hotspot-popup">
                <strong>Waste Hotspot</strong>

                <div>
                  <span>Priority:</span>{" "}
                  <strong>
                    {hotspot.priority.toUpperCase()}
                  </strong>
                </div>

                <div>
                  <span>Total reports:</span>{" "}
                  {hotspot.report_count}
                </div>

                <div>
                  <span>High priority:</span>{" "}
                  {hotspot.high_priority_reports}
                </div>

                <div>
                  <span>Latitude:</span>{" "}
                  {hotspot.latitude.toFixed(5)}
                </div>

                <div>
                  <span>Longitude:</span>{" "}
                  {hotspot.longitude.toFixed(5)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default HotspotLayer;