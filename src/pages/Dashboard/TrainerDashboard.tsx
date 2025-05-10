
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Activity, DollarSign, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Clock from "@/components/Clock";
import { Link } from "react-router-dom";

const TrainerDashboard = () => {
  const { user } = useAuth();
  
  // Dados fictícios para demonstração
  const stats = {
    totalStudents: 12,
    sessionsToday: 5,
    sessionsWeek: 24,
    monthlyRevenue: "R$ 4.800",
  };
  
  const upcomingSessions = [
    { id: "1", student: "Carlos Almeida", time: "08:00", duration: "1h" },
    { id: "2", student: "Marina Costa", time: "10:00", duration: "1h" },
    { id: "3", student: "João Silva", time: "14:00", duration: "1h" },
  ];
  
  const recentStudents = [
    { id: "1", name: "Pedro Santos", goal: "Ganho de massa muscular", progress: "Bom", avatar: "" },
    { id: "2", name: "Ana Beatriz", goal: "Perda de peso", progress: "Ótimo", avatar: "" },
    { id: "3", name: "Lucas Oliveira", goal: "Condicionamento físico", progress: "Regular", avatar: "" },
  ];
  
  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Olá, {user?.name || 'Treinador'}!</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu dashboard de personal trainer.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/agenda">Ver Agenda</Link>
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Alunos</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sessões Hoje</p>
                <p className="text-2xl font-bold">{stats.sessionsToday}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sessões Semanais</p>
                <p className="text-2xl font-bold">{stats.sessionsWeek}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Receita Mensal</p>
                <p className="text-2xl font-bold">{stats.monthlyRevenue}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule & Recent Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Agenda de Hoje</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-medium text-sm">{getInitials(session.student)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{session.student}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {session.time} • {session.duration}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm">
                    Ver todos os agendamentos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alunos Recentes</CardTitle>
              <CardDescription>Progressos e metas dos alunos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Meta: {student.goal}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          student.progress === "Ótimo"
                            ? "bg-green-500/20 text-green-500"
                            : student.progress === "Bom"
                            ? "bg-primary/20 text-primary"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {student.progress}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Activity className="h-4 w-4" />
                        <span className="sr-only">Ver progresso</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/alunos">Ver todos os alunos</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
