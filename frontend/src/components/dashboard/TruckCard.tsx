import {
  Clock3,
  MapPin,
  Navigation,
  Truck,
} from "lucide-react";

interface TruckCardProps {
  id: string;
  area: string;
  status: "Active" | "On route" | "Idle";
  eta: string;
}

function TruckCard({
  id,
  area,
  status,
  eta,
}: TruckCardProps) {
  return (
    <div className="truck-card">
      <div className="truck-icon">
        <Truck size={19} />
      </div>

      <div className="truck-info">
        <div className="truck-title">
          <strong>{id}</strong>

          <span className={`truck-status ${status.toLowerCase().replace(" ", "-")}`}>
            <span />
            {status}
          </span>
        </div>

        <div className="truck-location">
          <MapPin size={12} />
          {area}
        </div>

        <div className="truck-eta">
          <Clock3 size={12} />
          ETA {eta}
        </div>
      </div>

      <Navigation size={17} className="truck-navigation" />
    </div>
  );
}

export default TruckCard;