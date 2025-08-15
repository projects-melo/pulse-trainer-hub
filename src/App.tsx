
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";

// Páginas públicas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CompleteRegistration from "./pages/CompleteRegistration";

// Páginas protegidas
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Students from "./pages/Students";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Workouts from "./pages/Workouts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              
              {/* Rota para completar cadastro */}
              <Route
                path="/completar-cadastro"
                element={
                  <ProtectedRoute>
                    <CompleteRegistration />
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas protegidas (qualquer usuário logado) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agenda"
                element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas específicas para personal trainers */}
              <Route
                path="/alunos"
                element={
                  <RoleProtectedRoute roles={["trainer"]}>
                    <Students />
                  </RoleProtectedRoute>
                }
              />
              
              {/* Rotas específicas para alunos */}
              <Route
                path="/progresso"
                element={
                  <RoleProtectedRoute roles={["student"]}>
                    <Progress />
                  </RoleProtectedRoute>
                }
              />
              
              {/* Rota para treinos (disponível para ambos os tipos de usuário) */}
              <Route
                path="/treinos"
                element={
                  <ProtectedRoute>
                    <Workouts />
                  </ProtectedRoute>
                }
              />
              
              {/* Rota para qualquer outra URL não encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
