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

function getPriorityLabel(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized === "critical") {
    return "CRITICAL";
  }

  if (normalized === "high") {
    return "HIGH";
  }

  if (normalized === "medium") {
    return "MEDIUM";
  }

  return "LOW";
}

function HotspotLayer({
  hotspots,
}: HotspotLayerProps) {
  return (
    <>
      {hotspots.map((hotspot, index) => {
        const priority = hotspot.priority.toLowerCase();

        const color = getHotspotColor(
          hotspot.priority,
        );

        const radius = getHotspotRadius(
          hotspot.priority,
        );

        const priorityLabel =
          getPriorityLabel(hotspot.priority);

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
              <div
                style={{
                  minWidth: "220px",
                  fontFamily:
                    "Arial, sans-serif",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    WASTE HOTSPOT
                  </div>

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {priorityLabel} PRIORITY
                  </div>
                </div>

                {/* Statistics */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      background: "#f5f5f5",
                      borderRadius: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#777",
                      }}
                    >
                      Total reports
                    </div>

                    <strong
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {hotspot.report_count}
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "8px",
                      background: "#f5f5f5",
                      borderRadius: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#777",
                      }}
                    >
                      High priority
                    </div>

                    <strong
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {
                        hotspot.high_priority_reports
                      }
                    </strong>
                  </div>
                </div>

                {/* Location */}
                <div
                  style={{
                    borderTop:
                      "1px solid #e5e5e5",
                    paddingTop: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#777",
                      marginBottom: "3px",
                    }}
                  >
                    LOCATION
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    {hotspot.latitude.toFixed(
                      5,
                    )}
                    ,{" "}
                    {hotspot.longitude.toFixed(
                      5,
                    )}
                  </div>
                </div>

                {/* Recommendation */}
                <div
                  style={{
                    marginTop: "10px",
                    padding: "9px",
                    borderRadius: "6px",
                    background:
                      priority === "high" ||
                      priority === "critical"
                        ? "#fff3f1"
                        : "#fff8eb",
                    fontSize: "12px",
                    lineHeight: 1.4,
                  }}
                >
                  {priority === "high" ||
                  priority === "critical" ? (
                    <strong>
                      Prioritize this area
                      for waste collection.
                    </strong>
                  ) : (
                    <span>
                      Monitor this area and
                      include it in the
                      collection plan.
                    </span>
                  )}
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