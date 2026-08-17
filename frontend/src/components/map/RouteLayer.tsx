import { Polyline, CircleMarker, Popup } from "react-leaflet";

interface RouteLayerProps {
  coordinates: [number, number][];
}

function RouteLayer({
  coordinates,
}: RouteLayerProps) {
  if (!coordinates.length) {
    return null;
  }

  return (
    <>
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: "#287a52",
          weight: 5,
          opacity: 0.85,
        }}
      />

      {coordinates.map(
        (coordinate, index) => (
          <CircleMarker
            key={`${coordinate[0]}-${coordinate[1]}-${index}`}
            center={coordinate}
            radius={index === 0 ? 7 : 6}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor:
                index === 0
                  ? "#287a52"
                  : "#d58b35",
              fillOpacity: 1,
            }}
          >
            <Popup>
              {index === 0
                ? "Truck 104"
                : `Collection Stop ${index}`}
            </Popup>
          </CircleMarker>
        ),
      )}
    </>
  );
}

export default RouteLayer;