import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApiProvider } from './api';
import { App } from './App';
import { UserProvider } from './context';

export function Root() {
  const queryClient = React.useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <UserProvider>
        <ApiProvider>
          <App />
        </ApiProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
