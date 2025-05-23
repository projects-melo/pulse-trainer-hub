
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader, CalendarRange, Activity, TrendingUp, Weight, Ruler, Dumbbell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ProgressPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Mock data for progress metrics
  const [progressData, setProgressData] = useState({
    weight: {
      current: 75,
      goal: 70,
      history: [
        { date: '01/05', value: 80 },
        { date: '08/05', value: 78 },
        { date: '15/05', value: 76.5 },
        { date: '22/05', value: 75 },
        { date: '29/05', value: 75 },
      ],
    },
    measurements: {
      chest: { current: 95, previous: 97 },
      waist: { current: 83, previous: 85 },
      hips: { current: 100, previous: 102 },
      arms: { current: 32, previous: 31 },
      thighs: { current: 55, previous: 56 },
    },
    workouts: {
      week: 3,
      total: 4,
      completed: [
        { name: 'Segunda', value: 1 },
        { name: 'Terça', value: 1 },
        { name: 'Quarta', value: 0 },
        { name: 'Quinta', value: 1 },
        { name: 'Sexta', value: 0 },
        { name: 'Sábado', value: 0 },
        { name: 'Domingo', value: 0 },
      ],
    },
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meu Progresso</h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução e métricas de desempenho
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="measurements">Medidas</TabsTrigger>
            <TabsTrigger value="workouts">Treinos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Weight className="h-5 w-5 text-primary" />
                    Peso
                  </CardTitle>
                  <CardDescription>Meta: {progressData.weight.goal} kg</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Progresso</p>
                        <p className="text-sm font-medium">
                          {progressData.weight.current} kg / {progressData.weight.goal} kg
                        </p>
                      </div>
                      <Progress
                        value={
                          ((progressData.weight.goal - progressData.weight.current) / 
                          (progressData.weight.goal - progressData.weight.history[0].value)) * 100
                        }
                      />
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Histórico de Peso</p>
                      <div className="h-[120px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={progressData.weight.history}
                            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={10} />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} fontSize={10} />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Medidas Corporais
                  </CardTitle>
                  <CardDescription>Comparação com última medição</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(progressData.measurements).map(([key, value]) => {
                      const diff = value.current - value.previous;
                      return (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm capitalize font-medium">{key}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">{value.current} cm</span>
                              <span
                                className={`text-xs ${
                                  diff < 0
                                    ? "text-green-500"
                                    : diff > 0
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {diff < 0 ? "-" : diff > 0 ? "+" : ""}
                                {Math.abs(diff)} cm
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={50}
                            className={`h-1 ${
                              diff < 0
                                ? "bg-green-200 [&>div]:bg-green-500"
                                : diff > 0
                                ? "bg-red-200 [&>div]:bg-red-500"
                                : ""
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Treinos
                  </CardTitle>
                  <CardDescription>Treinos esta semana: {progressData.workouts.week}/{progressData.workouts.total}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Progresso semanal</p>
                        <p className="text-sm font-medium">
                          {progressData.workouts.week}/{progressData.workouts.total}
                        </p>
                      </div>
                      <Progress
                        value={(progressData.workouts.week / progressData.workouts.total) * 100}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Dias da semana</p>
                      <div className="flex justify-between">
                        {progressData.workouts.completed.map((day, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className={`h-6 w-6 rounded-full flex items-center justify-center mb-1 ${
                                day.value
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {day.value ? "✓" : ""}
                            </div>
                            <span className="text-[10px]">
                              {day.name.substring(0, 1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tendência de Progresso</CardTitle>
                <CardDescription>
                  Seu progresso ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Semana 1", peso: 80, forca: 60, cardio: 40 },
                        { name: "Semana 2", peso: 78, forca: 65, cardio: 45 },
                        { name: "Semana 3", peso: 76.5, forca: 70, cardio: 50 },
                        { name: "Semana 4", peso: 75, forca: 75, cardio: 55 },
                        { name: "Semana 5", peso: 75, forca: 80, cardio: 60 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                      />
                      <Tooltip />
                      <Bar
                        yAxisId="left"
                        dataKey="peso"
                        fill="hsl(var(--primary))"
                        name="Peso (kg)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="forca"
                        fill="hsl(var(--secondary))"
                        name="Força"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="cardio"
                        fill="#ffc658"
                        name="Cardio"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Measurements Tab */}
          <TabsContent value="measurements" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes das Medidas</CardTitle>
                <CardDescription>
                  Registro histórico das suas medidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(progressData.measurements).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <h3 className="text-lg font-medium capitalize">{key}</h3>
                      <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { date: "Mar", value: value.previous + 2 },
                              { date: "Abr", value: value.previous },
                              { date: "Mai", value: value.current },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Treinos</CardTitle>
                <CardDescription>
                  Seus treinos recentes e desempenho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Peitoral & Tríceps", "Costas & Bíceps", "Pernas", "Funcional"].map((workout, index) => (
                    <div key={index} className="flex items-center p-4 bg-secondary/30 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                        <Dumbbell className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{workout}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">
                            Duração: 45 min • Completado
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {["+10%", "+5%", "Mantido", "+8%"][index]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressPage;
