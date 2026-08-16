import {
  AlertTriangle,
  Clock3,
  MapPin,
} from "lucide-react";

interface DashboardReport {
  id: string;
  location: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  age: string;
}

interface ReportTableProps {
  reports: DashboardReport[];
}

function ReportTable({ reports }: ReportTableProps) {
  return (
    <div className="dashboard-table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Report</th>
            <th>Location</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Age</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>
                <strong>{report.id}</strong>
              </td>

              <td>
                <span className="table-location">
                  <MapPin size={13} />
                  {report.location}
                </span>
              </td>

              <td>{report.category}</td>

              <td>
                <span
                  className={`table-priority ${report.priority.toLowerCase()}`}
                >
                  <AlertTriangle size={12} />
                  {report.priority}
                </span>
              </td>

              <td>
                <span className="table-age">
                  <Clock3 size={12} />
                  {report.age}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;