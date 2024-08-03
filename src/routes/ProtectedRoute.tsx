// import { Navigate, Outlet } from "react-router-dom";

// interface ProtectedRouteProps {
//   isAuthenticated: boolean;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated }) => {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

import React from "react";

import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;

  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,

  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
