export type { HTTPError } from 'ky';

export interface LoginPayload {
  data: {
    username: string;
    password: string;
  };
}

export interface LoginResponse {
  data: {
    token: string;
  };
}
