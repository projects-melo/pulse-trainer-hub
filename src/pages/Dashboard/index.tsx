
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import TrainerDashboard from "./TrainerDashboard";
import StudentDashboard from "./StudentDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  // Se o usuário não estiver completamente registrado, redirecionar para completar cadastro
  if (!user) {
    return null;
  }

  return user.role === "trainer" ? <TrainerDashboard /> : <StudentDashboard />;
};

export default Dashboard;
