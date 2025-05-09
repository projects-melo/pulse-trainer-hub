import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Weight,
  Ruler,
  Heart,
  TrendingUp,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Clock from "@/components/Clock";

// Dados fictícios para demonstração
const mockProgressData = {
  weight: {
    current: 75.5,
    previous: 78.2,
    goal: 70,
    unit: "kg",
    history: [
      { date: "2023-01-01", value: 80.0 },
      { date: "2023-02-01", value: 79.2 },
      { date: "2023-03-01", value: 78.2 },
      { date: "2023-04-01", value: 76.8 },
      { date: "2023-05-01", value: 75.5 },
    ],
  },
  measurements: {
    chest: { current: 102, previous: 104, unit: "cm" },
    waist: { current: 84, previous: 86, unit: "cm" },
    hips: { current: 98, previous: 99, unit: "cm" },
    arms: { current: 35, previous: 34, unit: "cm" },
    thighs: { current: 58, previous: 57, unit: "cm" },
  },
  performanceTests: [
    {
      id: "1",
      name: "Corrida 1km",
      date: "2023-04-15",
      result: 5.2,
      previousResult: 5.8,
      unit: "min",
      improvement: true,
    },
    {
      id: "2",
      name: "Flexões (máx)",
      date: "2023-04-15",
      result: 25,
      previousResult: 20,
      unit: "reps",
      improvement: true,
    },
    {
      id: "3",
      name: "Prancha",
      date: "2023-04-15",
      result: 90,
      previousResult: 75,
      unit: "seg",
      improvement: true,
    },
    {
      id: "4",
      name: "Agachamento (máx)",
      date: "2023-04-15",
      result: 85,
      previousResult: 80,
      unit: "kg",
      improvement: true,
    },
  ],
  workouts: [
    {
      id: "1",
      date: "2023-04-28",
      name: "Treino A - Superior",
      completion: 100,
      duration: 65,
    },
    {
      id: "2",
      date: "2023-04-26",
      name: "Treino B - Inferior",
      completion: 100,
      duration: 55,
    },
    {
      id: "3",
      date: "2023-04-24",
      name: "Treino C - Cardio",
      completion: 90,
      duration: 40,
    },
    {
      id: "4",
      date: "2023-04-21",
      name: "Treino A - Superior",
      completion: 100,
      duration: 60,
    },
  ],
};

const Progress = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Avançar para o próximo mês
  const nextMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setSelectedMonth(newMonth);
  };

  // Retornar para o mês anterior
  const previousMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setSelectedMonth(newMonth);
  };

  // Formatar o mês atual para exibição
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  // Calcular a diferença e a direção de mudança (positiva ou negativa)
  const calculateChange = (current: number, previous: number) => {
    const diff = current - previous;
    return {
      value: Math.abs(diff),
      direction: diff >= 0 ? "increase" : "decrease",
      percentage: previous ? Math.abs((diff / previous) * 100).toFixed(1) : "0",
    };
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meu Progresso</h1>
          <p className="text-muted-foreground">
            Acompanhe seus resultados e evolução ao longo do tempo.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 md:w-[500px] mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="measurements">Medidas</TabsTrigger>
            <TabsTrigger value="tests">Testes</TabsTrigger>
            <TabsTrigger value="workouts">Treinos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weight Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Weight className="h-5 w-5 text-primary mr-2" />
                      Peso
                    </CardTitle>
                    <div className="text-xl font-bold">
                      {mockProgressData.weight.current} {mockProgressData.weight.unit}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Anterior</p>
                      <p className="font-medium">
                        {mockProgressData.weight.previous} {mockProgressData.weight.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Meta</p>
                      <p className="font-medium">
                        {mockProgressData.weight.goal} {mockProgressData.weight.unit}
                      </p>
                    </div>
                    <div>
                      {calculateChange(
                        mockProgressData.weight.current,
                        mockProgressData.weight.previous
                      ).direction === "decrease" ? (
                        <p className="text-green-500 flex items-center">
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          {calculateChange(
                            mockProgressData.weight.current,
                            mockProgressData.weight.previous
                          ).value}{" "}
                          {mockProgressData.weight.unit} ↓
                        </p>
                      ) : (
                        <p className="text-destructive flex items-center">
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          {calculateChange(
                            mockProgressData.weight.current,
                            mockProgressData.weight.previous
                          ).value}{" "}
                          {mockProgressData.weight.unit} ↑
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="h-[200px] bg-secondary/50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Gráfico de progresso de peso</p>
                  </div>
                </CardContent>
              </Card>

              {/* Body Measurements Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Ruler className="h-5 w-5 text-primary mr-2" />
                    Medidas Corporais
                  </CardTitle>
                  <CardDescription>Última atualização: 01/05/2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(mockProgressData.measurements).map(([key, data]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{key}</p>
                          <p className="text-sm text-muted-foreground">
                            Anterior: {data.previous} {data.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {data.current} {data.unit}
                          </p>
                          <p
                            className={`text-xs ${
                              data.current < data.previous
                                ? "text-green-500"
                                : data.current > data.previous
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {data.current < data.previous
                              ? `↓ ${data.previous - data.current} ${data.unit}`
                              : data.current > data.previous
                              ? `↑ ${data.current - data.previous} ${data.unit}`
                              : "Sem alteração"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Tests Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 text-primary mr-2" />
                    Testes de Performance
                  </CardTitle>
                  <CardDescription>Última avaliação: 15/04/2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProgressData.performanceTests.slice(0, 3).map((test) => (
                      <div key={test.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Anterior: {test.previousResult} {test.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {test.result} {test.unit}
                          </p>
                          <p
                            className={`text-xs ${
                              (test.unit === "min" && test.result < test.previousResult) ||
                              (test.unit !== "min" && test.result > test.previousResult)
                                ? "text-green-500"
                                : "text-destructive"
                            }`}
                          >
                            {(test.unit === "min" && test.result < test.previousResult) ||
                            (test.unit !== "min" && test.result > test.previousResult)
                              ? "Melhora"
                              : "Piora"}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      Ver todos os testes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Workouts Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-5 w-5 text-primary mr-2" />
                    Treinos Recentes
                  </CardTitle>
                  <CardDescription>Últimos treinos realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProgressData.workouts.slice(0, 3).map((workout) => (
                      <div key={workout.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {new Date(workout.date).toLocaleDateString("pt-BR")}
                            {" • "}
                            <Clock className="h-3.5 w-3.5 mx-1" />
                            {workout.duration} min
                          </div>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            workout.completion === 100
                              ? "bg-green-500/20 text-green-500"
                              : workout.completion >= 80
                              ? "bg-primary/20 text-primary"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {workout.completion}%
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      Ver histórico de treinos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="measurements">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Medidas Corporais</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={previousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="text-sm">{formatMonth(selectedMonth)}</p>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Acompanhe a evolução das suas medidas corporais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(mockProgressData.measurements).map(([key, data]) => (
                      <Card key={key} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm capitalize">{key}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl font-bold">
                            {data.current} {data.unit}
                          </div>
                          <p
                            className={`text-xs flex items-center gap-1 ${
                              data.current < data.previous
                                ? "text-green-500"
                                : data.current > data.previous
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {data.current < data.previous ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {data.previous - data.current} {data.unit}
                              </>
                            ) : data.current > data.previous ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {data.current - data.previous} {data.unit}
                              </>
                            ) : (
                              "Sem alteração"
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="rounded-md border p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Histórico de Medidas</h3>
                      <p className="text-sm text-muted-foreground">
                        Visualize seu progresso ao longo do tempo
                      </p>
                    </div>
                    <div className="h-[300px] bg-secondary/50 rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        Gráfico de histórico de medidas corporais
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Adicionar Novas Medidas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>Testes de Performance</CardTitle>
                <CardDescription>
                  Resultados dos seus testes físicos e avaliações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockProgressData.performanceTests.map((test) => (
                      <Card key={test.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">{test.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl font-bold">
                            {test.result} {test.unit}
                          </div>
                          <p
                            className={`text-xs flex items-center gap-1 ${
                              (test.unit === "min" && test.result < test.previousResult) ||
                              (test.unit !== "min" && test.result > test.previousResult)
                                ? "text-green-500"
                                : "text-destructive"
                            }`}
                          >
                            {(test.unit === "min" && test.result < test.previousResult) ||
                            (test.unit !== "min" && test.result > test.previousResult) ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {Math.abs(test.result - test.previousResult)} {test.unit}{" "}
                                {test.unit === "min" ? "mais rápido" : "de melhora"}
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {Math.abs(test.result - test.previousResult)} {test.unit}{" "}
                                {test.unit === "min" ? "mais lento" : "de redução"}
                              </>
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="rounded-md border p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Histórico de Testes</h3>
                      <p className="text-sm text-muted-foreground">
                        Comparação dos resultados ao longo do tempo
                      </p>
                    </div>
                    <div className="h-[300px] bg-secondary/50 rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        Gráfico de evolução dos testes de performance
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Histórico de Treinos</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={previousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="text-sm">{formatMonth(selectedMonth)}</p>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Acompanhe seus treinos e performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProgressData.workouts.map((workout) => (
                    <Card key={workout.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex flex-col items-center justify-center">
                              <span className="text-xs font-medium">
                                {new Date(workout.date).getDate()}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(workout.date).toLocaleString("pt-BR", {
                                  month: "short",
                                })}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{workout.name}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {workout.duration} minutos
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${
                                workout.completion === 100
                                  ? "bg-green-500/20 text-green-500"
                                  : workout.completion >= 80
                                  ? "bg-primary/20 text-primary"
                                  : "bg-yellow-500/20 text-yellow-500"
                              }`}
                            >
                              {workout.completion}% completo
                            </div>
                            <Button variant="outline" size="sm">
                              Detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex justify-center">
                    <Button>
                      Ver Todos os Treinos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Progress;
