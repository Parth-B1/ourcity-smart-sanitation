import { CircleMarker, Polyline, Popup } from "react-leaflet";

const route: [number, number][] = [
  [21.1585, 79.0715],
  [21.1562, 79.0755],
  [21.1538, 79.0788],
  [21.1525, 79.0808],
  [21.1501, 79.0835],
  [21.1468, 79.0858],
  [21.1425, 79.0875],
];

const stops = [
  {
    name: "Collection Stop 1",
    position: [21.1585, 79.0715] as [number, number],
  },
  {
    name: "Collection Stop 2",
    position: [21.1538, 79.0788] as [number, number],
  },
  {
    name: "Collection Stop 3",
    position: [21.1501, 79.0835] as [number, number],
  },
  {
    name: "Collection Stop 4",
    position: [21.1425, 79.0875] as [number, number],
  },
];

function RouteLayer() {
  return (
    <>
      <Polyline
        positions={route}
        pathOptions={{
          color: "#287a52",
          weight: 5,
          opacity: 0.8,
        }}
      />

      {stops.map((stop) => (
        <CircleMarker
          key={stop.name}
          center={stop.position}
          radius={5}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: "#287a52",
            fillOpacity: 1,
          }}
        >
          <Popup>
            <strong>{stop.name}</strong>

            <br />

            Garbage collection stop
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

export default RouteLayer;