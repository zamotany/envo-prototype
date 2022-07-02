import ky from 'ky';
import { LoginPayload, LoginResponse } from '../types';

export const postForToken =
  (client: typeof ky) => async (payload: LoginPayload) => {
    return client
      .post('user/token', {
        json: payload,
      })
      .json<LoginResponse>();
  };
