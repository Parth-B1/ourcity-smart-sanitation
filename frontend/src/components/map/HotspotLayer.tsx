import { CircleMarker, Popup } from "react-leaflet";

const hotspots = [
  {
    id: 1,
    name: "Dharampeth",
    position: [21.1525, 79.0808] as [number, number],
    reports: 38,
    priority: "High",
  },
  {
    id: 2,
    name: "Sadar",
    position: [21.1615, 79.083] as [number, number],
    reports: 31,
    priority: "High",
  },
  {
    id: 3,
    name: "Civil Lines",
    position: [21.1577, 79.0715] as [number, number],
    reports: 22,
    priority: "Medium",
  },
  {
    id: 4,
    name: "Manish Nagar",
    position: [21.1165, 79.0735] as [number, number],
    reports: 16,
    priority: "Medium",
  },
];

function getHotspotColor(priority: string) {
  switch (priority) {
    case "High":
      return "#dc4f3d";
    case "Medium":
      return "#e2a03d";
    default:
      return "#52a46f";
  }
}

function HotspotLayer() {
  return (
    <>
      {hotspots.map((hotspot) => (
        <CircleMarker
          key={hotspot.id}
          center={hotspot.position}
          radius={12}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: getHotspotColor(hotspot.priority),
            fillOpacity: 0.85,
          }}
        >
          <Popup>
            <strong>{hotspot.name}</strong>

            <br />

            {hotspot.reports} reports

            <br />

            Priority: {hotspot.priority}
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

export default HotspotLayer;