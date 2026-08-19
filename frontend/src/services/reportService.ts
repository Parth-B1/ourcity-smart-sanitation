export interface ReportCreate {
  category: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

export interface ReportResponse {
  id: number;
  report_code: string;
  category: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  priority: string;
  ai_category: string | null;
  ai_confidence: number | null;
  ai_severity: string | null;
  ai_reasoning: string | null;
  created_at: string;
}

const API_URL = "http://127.0.0.1:8000";

export async function createReport(
  data: ReportCreate,
  image?: File | null,
): Promise<ReportResponse> {
  const formData = new FormData();

  formData.append("category", data.category);

  if (data.description) {
    formData.append(
      "description",
      data.description,
    );
  }

  formData.append("location", data.location);

  if (data.latitude !== undefined) {
    formData.append(
      "latitude",
      String(data.latitude),
    );
  }

  if (data.longitude !== undefined) {
    formData.append(
      "longitude",
      String(data.longitude),
    );
  }

  if (image) {
    formData.append("image", image);
  }

  const response = await fetch(
    `${API_URL}/api/reports/`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to submit report");
  }

  return response.json();
}
export async function getReports(): Promise<
  ReportResponse[]
> {
  const response = await fetch(
    `${API_URL}/api/reports/`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  return response.json();
}

export async function getReport(
  id: number,
  
): Promise<ReportResponse> {
  const response = await fetch(
    `${API_URL}/api/reports/${id}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch report");
  }

  return response.json();
}