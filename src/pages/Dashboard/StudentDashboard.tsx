
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Activity, TrendingUp, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Dados fictícios para demonstração
  const nextSession = {
    date: new Date(),
    time: "14:00",
    trainer: "Ana Silva",
  };
  
  const progressData = {
    weightGoal: {
      current: 75,
      target: 70,
      progress: 50,
    },
    workoutsCompleted: 8,
    workoutsTotal: 12,
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Olá, {user?.name || 'Aluno'}!</h1>
          <p className="text-muted-foreground">Bem-vindo ao seu dashboard. Aqui você pode acompanhar seu progresso e próximas sessões.</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Próxima Sessão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <p className="font-medium">
                  {nextSession.date.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{nextSession.time}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Com {nextSession.trainer}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Progresso do Treino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">Treinos completados</p>
                    <p className="text-sm font-medium">
                      {progressData.workoutsCompleted}/{progressData.workoutsTotal}
                    </p>
                  </div>
                  <Progress value={(progressData.workoutsCompleted / progressData.workoutsTotal) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Meta de Peso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">Progresso</p>
                    <p className="text-sm font-medium">
                      {progressData.weightGoal.current}kg / {progressData.weightGoal.target}kg
                    </p>
                  </div>
                  <Progress value={progressData.weightGoal.progress} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Seus últimos treinos e avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Treino de {["Força", "Cardio", "Flexibilidade"][item - 1]}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - item * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm mt-1">
                        {["Completou todos os exercícios", "Aumentou carga em 5kg", "Nova avaliação física"][item - 1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progressos</CardTitle>
              <CardDescription>Suas melhorias ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-primary/5 rounded-md">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Gráfico de progresso será exibido aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
