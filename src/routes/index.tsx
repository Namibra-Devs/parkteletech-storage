import { Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { useAuth } from "@/hooks/context/AuthContext";

import DashboardPage from "@/pages/DashboardPage";
import FolderView from "@/pages/FolderView";
import NotFound from "@/pages/NotFound";
import SignInPage from "@/pages/SignInPage";
import Trash from "@/pages/Trash";

const DashboardLayout = lazy(
  () => import("@/components/layout/dashboard-layout")
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  const dashboardRoutes = [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          element: <DashboardPage />,
          index: true,
        },
        {
          path: "trash",
          element: <Trash />,
        },
        {
          path: "folder",
          element: <FolderView />,
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/" replace /> : <SignInPage />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
