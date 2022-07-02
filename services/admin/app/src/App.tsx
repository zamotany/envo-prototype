import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import { useUser } from './context';
import { Environment } from './screens/Environment';
import { Home } from './screens/Home';
import { Login } from './screens/Login';
import { Project } from './screens/Project';

export function App() {
  const { isAuthenticated } = useUser({ subscribe: true });

  return (
    <PageLayout>
      <Routes>
        <Route path="/admin">
          <Route index element={isAuthenticated ? <Home /> : <Login />} />
          {isAuthenticated ? (
            <Route path="project/:projectId">
              <Route index element={<Project />} />
              <Route
                path="environment/:environmentId"
                element={<Environment />}
              />
            </Route>
          ) : null}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </PageLayout>
  );
}
