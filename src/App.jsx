import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./components/layouts/RootLayout";
import RequireAuth from "./components/protected/RequireAuth";
import RequireAdmin from "./components/protected/RequireAdmin";
import Login from "./pages/Login";
import TeamList from "./pages/Teams/TeamList";
import TeamDetail from "./pages/Teams/TeamDetail";
import ProjectList from "./pages/Projects/ProjectList";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/Admin/index";
import Cadastro from "./pages/Cadastro";

// Lazy-loaded components
const Analytics = lazy(() => import("./pages/Teams/TeamDetail/Analytics"));
const AdminTeams = lazy(() => import("./pages/Admin/AdminTeams"));
const AdminProjects = lazy(() => import("./pages/Admin/AdminProjects"));
const AdminSkills = lazy(() => import("./pages/Admin/AdminSkills"));
const AdminCategories = lazy(() => import("./pages/Admin/AdminCategories"));

// ✅ Create a wrapper component with Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <RootLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/teams" replace /> },
      {
        path: "teams",
        children: [
          { index: true, element: <TeamList /> },
          {
            path: ":id",
            element: <TeamDetail />,
          },
        ],
      },
      {
        path: "projects",
        children: [
          { index: true, element: <ProjectList /> },
          { path: ":id", element: <ProjectDetail /> },
        ],
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "admin",
        element: (
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        ),
        children: [
          { index: true, element: <Navigate to="teams" replace /> },
          // ✅ Wrap lazy-loaded components with Suspense
          {
            path: "teams",
            element: (
              <SuspenseWrapper>
                <AdminTeams />
              </SuspenseWrapper>
            ),
          },
          {
            path: "projects",
            element: (
              <SuspenseWrapper>
                <AdminProjects />
              </SuspenseWrapper>
            ),
          },
          {
            path: "skills",
            element: (
              <SuspenseWrapper>
                <AdminSkills />
              </SuspenseWrapper>
            ),
          },
          {
            path: "categories",
            element: (
              <SuspenseWrapper>
                <AdminCategories />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
