
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, registrationData } = useAuth();
  const currentPath = window.location.pathname;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  // Se estiver na rota de completar cadastro e tiver dados de registro, permite o acesso
  // mesmo sem um usuário completamente autenticado
  if (currentPath === "/completar-cadastro" && registrationData) {
    return <>{children}</>;
  }
  
  // Para outras rotas protegidas, exige um usuário completamente autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
