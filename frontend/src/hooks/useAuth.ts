const API_URL = "http://127.0.0.1:8000";

export type UserRole =
  | "citizen"
  | "nmc_officer"
  | "truck_operator";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  truck_id?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

const TOKEN_KEY = "ourcity_access_token";
const USER_KEY = "ourcity_user";

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Login failed",
    );
  }

  const data: LoginResponse = await response.json();

  localStorage.setItem(
    TOKEN_KEY,
    data.access_token,
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user),
  );

  return data;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}