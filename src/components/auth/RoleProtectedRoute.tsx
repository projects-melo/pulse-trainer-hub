
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  roles: ("trainer" | "student")[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
