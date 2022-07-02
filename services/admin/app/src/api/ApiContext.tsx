import * as React from 'react';
import { useUser } from '../context';
import { createApiClient, ApiClient } from './apiClient';

const ApiContext = React.createContext({
  client: undefined as ApiClient | undefined,
});

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { getToken, onChange } = useUser();
  const contextRef = React.useRef({
    client: createApiClient({ getToken }),
  });

  React.useEffect(() => {
    return onChange(() => {
      contextRef.current.client.reset();
    });
  }, []);

  return (
    <ApiContext.Provider value={contextRef.current}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiClient() {
  const { client } = React.useContext(ApiContext);

  if (!client) {
    throw new Error('Client context is not available');
  }

  return client;
}
