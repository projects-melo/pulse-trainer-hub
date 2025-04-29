
import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { pt } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, User, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Dados fictícios para demonstração
const mockSessions = [
  { id: "1", date: new Date(), startTime: "08:00", endTime: "09:00", student: "Carlos Almeida", status: "scheduled" },
  { id: "2", date: new Date(), startTime: "10:00", endTime: "11:00", student: "Marina Costa", status: "scheduled" },
  { id: "3", date: addDays(new Date(), 1), startTime: "09:00", endTime: "10:00", student: "João Silva", status: "scheduled" },
  { id: "4", date: addDays(new Date(), 2), startTime: "16:00", endTime: "17:00", student: "Ana Laura", status: "scheduled" },
  { id: "5", date: addDays(new Date(), 3), startTime: "14:00", endTime: "15:00", student: "Pedro Santos", status: "scheduled" },
];

const Schedule = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Avançar para a próxima semana
  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // Retornar para a semana anterior
  const previousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  // Gerar os dias da semana atual
  const daysOfWeek = [...Array(7)].map((_, index) => addDays(currentWeek, index));
  
  // Filtra as sessões para um determinado dia
  const getSessionsForDay = (date: Date) => {
    return mockSessions.filter(
      (session) =>
        session.date.getDate() === date.getDate() &&
        session.date.getMonth() === date.getMonth() &&
        session.date.getFullYear() === date.getFullYear()
    );
  };

  // Formatar o intervalo de datas da semana atual para exibição
  const formatWeekRange = () => {
    const endOfWeek = addDays(currentWeek, 6);
    const startDateStr = format(currentWeek, "d", { locale: pt });
    const endDateStr = format(endOfWeek, "d 'de' MMMM, yyyy", { locale: pt });
    const startMonthStr = format(currentWeek, "MMMM", { locale: pt });
    
    if (currentWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startDateStr} - ${endDateStr}`;
    } else {
      return `${startDateStr} de ${startMonthStr} - ${endDateStr}`;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agenda</h1>
            <p className="text-muted-foreground">
              Gerencie suas sessões de treino e disponibilidade.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {user?.role === "trainer" ? "Nova Sessão" : "Agendar Sessão"}
          </Button>
        </div>

        {/* Weekly Calendar Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Calendário Semanal</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={previousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Semana anterior</span>
                </Button>
                <CardDescription className="m-0">
                  {formatWeekRange()}
                </CardDescription>
                <Button variant="outline" size="icon" onClick={nextWeek}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Próxima semana</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 bg-secondary">
              {daysOfWeek.map((day, i) => (
                <div
                  key={i}
                  className={`text-center py-2 font-medium ${
                    day.toDateString() === new Date().toDateString()
                      ? "bg-primary/10"
                      : ""
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {format(day, "EEEE", { locale: pt })}
                  </div>
                  <div>{format(day, "d", { locale: pt })}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-t">
              {daysOfWeek.map((day, i) => {
                const sessions = getSessionsForDay(day);
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={i}
                    className={`min-h-[200px] border-r last:border-r-0 p-2 ${
                      isToday ? "bg-primary/5" : ""
                    }`}
                  >
                    {sessions.length > 0 ? (
                      <div className="space-y-2">
                        {sessions.map((session) => (
                          <div
                            key={session.id}
                            className="bg-background border shadow-sm rounded-md p-2 text-sm break-words"
                          >
                            <div className="font-medium mb-1 truncate">
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span className="truncate">{session.student}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Sem sessões</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Sessões</CardTitle>
            <CardDescription>Sessões agendadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex flex-col items-center justify-center">
                      <span className="text-xs font-medium">
                        {format(session.date, "d", { locale: pt })}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(session.date, "MMM", { locale: pt })}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{session.student}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
