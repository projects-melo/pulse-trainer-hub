
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import TrainerDashboard from "./TrainerDashboard";
import StudentDashboard from "./StudentDashboard";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not authenticated, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // If user is still loading or not defined, return a loading state
  if (!user) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return user.role === "trainer" ? <TrainerDashboard /> : <StudentDashboard />;
};

export default Dashboard;
