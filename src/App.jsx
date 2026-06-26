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
import AdminLayout from "./pages/Admin";

// Lazy-loaded components
const Analytics = lazy(() => import("./pages/Teams/TeamDetail/Analytics"));
const AdminTeams = lazy(() => import("./pages/Admin/AdminTeams"));
const AdminProjects = lazy(() => import("./pages/Admin/AdminProjects"));
const AdminSkills = lazy(() => import("./pages/Admin/AdminSkills"));
const AdminCategories = lazy(() => import("./pages/Admin/AdminCategories"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
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
            children: [
              { index: true, element: <Navigate to="?tab=overview" replace /> },
              // Tabs are handled inside TeamDetail via Outlet and useSearchParams
              // We'll define child routes for each tab but we can also render them directly.
              // For simplicity, we'll render the content inside TeamDetail based on tab.
              // So we don't need nested routes here; we'll just use a single route and render tabs manually.
            ],
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
          { path: "teams", element: <AdminTeams /> },
          { path: "projects", element: <AdminProjects /> },
          { path: "skills", element: <AdminSkills /> },
          { path: "categories", element: <AdminCategories /> },
        ],
      },
    ],
  },
]);

export default router;
