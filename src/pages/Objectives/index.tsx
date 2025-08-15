import React from "react";
import Layout from "@/components/layout/Layout";
import { ObjectiveManager } from "@/components/objectives/ObjectiveManager";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const ObjectivesPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Objetivos</h1>
              <p className="text-muted-foreground">
                Gerencie seus objetivos de treino e acompanhe seu progresso.
              </p>
            </div>
            
            <ObjectiveManager />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ObjectivesPage;