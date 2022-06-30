import ky from 'ky';
import { postLogin } from './requests/login';

interface ApiClientOptions {
  getToken: () => string | undefined;
}

export function createApiClient({ getToken }: ApiClientOptions) {
  let httpClient: typeof ky | undefined;
  let lastToken = getToken();

  if (!httpClient || lastToken !== getToken()) {
    lastToken = getToken();
    httpClient = ky.extend({
      // TODO: move to config
      prefixUrl: 'https://localhost:4443/api/admin',
      headers: {
        Authorization: `Bearer ${lastToken}`,
      },
    });
  }

  return {
    httpClient,
    postLogin: postLogin(httpClient),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
