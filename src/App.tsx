// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { TeamDetail } from "./pages/TeamDetail";
import { TeamsList } from "./pages/TeamsList";
import { ProjectsList } from "./pages/ProjectsList";
import { UsersList } from "./pages/UsersList";
import { Profile } from "./pages/Profile";
import { AdminPanel } from "./pages/AdminPanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/teams/me" replace />} />
              <Route path="/teams/me" element={<Navigate to="/teams/:id" />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/teams" element={<TeamsList />} />
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
