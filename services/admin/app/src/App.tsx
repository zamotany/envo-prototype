import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import { useUser } from './context';
import { Home } from './screens/Home';
import { Login } from './screens/Login';

export function App() {
  const { isAuthenticated } = useUser({ subscribe: true });

  return (
    <PageLayout>
      <Routes>
        <Route path="/admin">
          <Route index element={isAuthenticated ? <Home /> : <Login />} />
          {/* <Route path="teams" element={<Teams />}>
                  <Route path=":teamId" element={<Team />} />
                  <Route path="new" element={<NewTeamForm />} />
                  <Route index element={<LeagueStandings />} />
                </Route> */}
        </Route>
      </Routes>
    </PageLayout>
  );
}
