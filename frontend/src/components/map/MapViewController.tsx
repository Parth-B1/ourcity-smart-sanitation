import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

interface MapViewControllerProps {
  coordinates: [number, number][];
}

function MapViewController({
  coordinates,
}: MapViewControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length === 0) {
      return;
    }

    const bounds =
      coordinates as LatLngBoundsExpression;

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 14,
    });
  }, [coordinates, map]);

  return null;
}

export default MapViewController;