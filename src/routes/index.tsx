import { Suspense, lazy } from "react";
import { Navigate, Outlet, useNavigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import DashboardPage from "@/pages/DashboardPage";
import FolderView from "@/pages/FolderView";
import NotFound from "@/pages/NotFound";
import SignInPage from "@/pages/SignInPage";
import Trash from "@/pages/Trash";
import { ACCESS_TOKEN_KEY } from "@/constants";
import { checkAndRemoveExpiredTokens } from "@/lib/utils";

const DashboardLayout = lazy(
  () => import("@/components/layout/dashboard-layout")
);

export default function AppRouter() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const isTokenExpired = checkAndRemoveExpiredTokens();
  const navigate = useNavigate();
  if (isTokenExpired) {
    navigate("/login");
  }

  const dashboardRoutes = [
    {
      path: "/",
      element: (
        <ProtectedRoute isAuthenticated={!!accessToken}>
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
          path: "folder/:id",
          element: <FolderView />,
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/login",
      element: accessToken ? <Navigate to="/" replace /> : <SignInPage />,
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
