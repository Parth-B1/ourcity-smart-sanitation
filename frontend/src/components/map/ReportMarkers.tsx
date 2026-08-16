import { CircleMarker, Popup } from "react-leaflet";

const reports = [
  {
    id: "OS-00842",
    location: "Dharampeth",
    position: [21.1538, 79.0788] as [number, number],
    category: "Mixed household waste",
    priority: "High",
  },
  {
    id: "OS-00841",
    location: "Sadar",
    position: [21.1602, 79.085] as [number, number],
    category: "Overflowing bin",
    priority: "High",
  },
  {
    id: "OS-00839",
    location: "Civil Lines",
    position: [21.1565, 79.0698] as [number, number],
    category: "Plastic waste",
    priority: "Medium",
  },
  {
    id: "OS-00836",
    location: "Manish Nagar",
    position: [21.1175, 79.075] as [number, number],
    category: "Illegal dumping",
    priority: "Medium",
  },
];

function ReportMarkers() {
  return (
    <>
      {reports.map((report) => (
        <CircleMarker
          key={report.id}
          center={report.position}
          radius={6}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor:
              report.priority === "High"
                ? "#d9533f"
                : "#d99a3a",
            fillOpacity: 1,
          }}
        >
          <Popup>
            <strong>{report.id}</strong>

            <br />

            {report.category}

            <br />

            {report.location}

            <br />

            Priority: {report.priority}
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

export default ReportMarkers;