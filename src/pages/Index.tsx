
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a página inicial real
    navigate("/");
  }, [navigate]);

  return null;
};

export default Index;
