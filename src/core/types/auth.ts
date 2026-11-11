export interface AuthUser {
  id: string;
  email: string;
  organizationId: string;
  organizationName: string;
}

export interface AuthOrganization {
  id: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}
