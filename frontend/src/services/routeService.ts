import { getToken } from "./authService";
export interface RouteStop {
  stop_number: number;
  latitude: number;
  longitude: number;
  priority: string;
  report_count: number;
  high_priority_reports: number;
  distance_from_previous_km: number;
  travel_time_minutes: number;
}

export interface OptimizedRoute {
  truck: {
    latitude: number;
    longitude: number;
  };

  total_distance_km: number;

  estimated_time_minutes: number;

  route_coordinates: [number, number][];

  stops: RouteStop[];
}

const API_URL = "http://127.0.0.1:8000";

export async function getOptimizedRoute(
  latitude: number,
  longitude: number,
): Promise<OptimizedRoute> {
  const response = await fetch(
    `${API_URL}/api/routes/optimize?latitude=${latitude}&longitude=${longitude}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch optimized route");
  }

  return response.json();
}

export async function completeCollection(
  latitude: number,
  longitude: number,
) {
  const token = getToken();

  if (!token) {
    throw new Error(
      "You are not authenticated.",
    );
  }

  const response = await fetch(
    `${API_URL}/api/trucks/collection-complete`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        latitude,
        longitude,
      }),
    },
  );

  if (!response.ok) {
    const error =
      await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        "Failed to complete collection",
    );
  }

  return response.json();
}