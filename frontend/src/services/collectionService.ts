import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000";

export interface CollectionEvent {
  id: number;
  truck_id: string;
  latitude: number;
  longitude: number;
  reports_resolved: number;
  completed_at: string;
}

export interface NearbyCollectionResponse {
  collection_completed: boolean;
  event: CollectionEvent | null;
}

export async function getNearbyCollection(
  latitude: number,
  longitude: number,
): Promise<NearbyCollectionResponse> {
  const token = getToken();

  if (!token) {
    throw new Error("You are not authenticated.");
  }

  const response = await fetch(
    `${API_URL}/api/collections/nearby?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const error =
      await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        "Failed to fetch collection status",
    );
  }

  return response.json();
}