import { CircleMarker, Popup } from "react-leaflet";

interface Report {
  id: number;
  report_code: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  priority: string;
}

interface ReportMarkersProps {
  reports?: Report[];
}

function ReportMarkers({ reports = [] }: ReportMarkersProps) {
  // Only show reports that have coordinates
  const geoReports = reports.filter(
    (r) => r.latitude !== null && r.longitude !== null,
  );

  return (
    <>
      {geoReports.map((report) => (
        <CircleMarker
          key={report.id}
          center={[report.latitude!, report.longitude!]}
          radius={6}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor:
              report.priority === "high" ||
              report.priority === "critical"
                ? "#d9533f"
                : report.priority === "medium"
                  ? "#d99a3a"
                  : "#52a46f",
            fillOpacity: 1,
          }}
        >
          <Popup>
            <strong>{report.report_code}</strong>

            <br />

            {report.category}

            <br />

            {report.location}

            <br />

            Priority: {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

export default ReportMarkers;