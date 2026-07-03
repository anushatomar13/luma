import { apiFetch } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiFetch<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => apiFetch<AuthUser>("/api/v1/auth/me"),
};
