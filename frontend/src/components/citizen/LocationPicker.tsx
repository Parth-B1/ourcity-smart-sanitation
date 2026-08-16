import { Crosshair, MapPin } from "lucide-react";
import { useState } from "react";

interface LocationPickerProps {
  onLocationChange?: (location: string) => void;
}

function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [location, setLocation] = useState("");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Location services unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationText = `${latitude.toFixed(5)}, ${longitude.toFixed(
          5,
        )}`;

        setLocation(locationText);
        onLocationChange?.(locationText);
      },
      () => {
        setLocation("Unable to detect location");
      },
    );
  };

  return (
    <div className="location-picker">
      <div className="location-input">
        <MapPin size={19} />

        <input
          type="text"
          placeholder="Enter location or detect automatically"
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
            onLocationChange?.(event.target.value);
          }}
        />

        <button
          type="button"
          onClick={detectLocation}
          title="Detect my location"
        >
          <Crosshair size={19} />
        </button>
      </div>

      <p>
        Your location helps the municipality identify the exact waste
        hotspot.
      </p>
    </div>
  );
}

export default LocationPicker;