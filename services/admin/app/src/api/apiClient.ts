import ky from 'ky';
import { postForToken } from './requests/login';

interface ApiClientOptions {
  getToken: () => string | undefined;
}

export function createApiClient({ getToken }: ApiClientOptions) {
  function initHttpClient() {
    return ky.extend({
      // TODO: move to config
      prefixUrl: 'https://localhost:4443/api/admin',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  }

  let httpClient = initHttpClient();

  function reset() {
    httpClient = initHttpClient();
  }

  function wrapRequestFunction<
    T extends (client: typeof ky) => (...args: any[]) => any
  >(fn: T) {
    return ((...args: Parameters<ReturnType<T>>) =>
      fn(httpClient)(...args)) as ReturnType<T>;
  }

  return {
    httpClient,
    reset,
    postForToken: wrapRequestFunction(postForToken),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
