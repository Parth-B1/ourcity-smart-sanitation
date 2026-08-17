export interface Hotspot {
  latitude: number;
  longitude: number;
  report_count: number;
  high_priority_reports: number;
  priority: string;
}

const API_URL = "http://127.0.0.1:8000";

export async function getHotspots(): Promise<Hotspot[]> {
  const response = await fetch(
    `${API_URL}/api/hotspots/`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hotspots");
  }

  return response.json();
}