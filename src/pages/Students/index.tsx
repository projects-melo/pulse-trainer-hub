
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, MoreVertical, Calendar, FileText, Activity, MessageSquare } from "lucide-react";

// Dados fictícios para demonstração
const studentsData = [
  { 
    id: "1", 
    name: "Carlos Almeida", 
    email: "carlos@example.com", 
    goal: "Ganho de massa muscular",
    lastSession: "2023-04-25",
    status: "active",
    progress: "good"
  },
  { 
    id: "2", 
    name: "Marina Costa", 
    email: "marina@example.com", 
    goal: "Perda de peso",
    lastSession: "2023-04-24",
    status: "active",
    progress: "excellent"
  },
  { 
    id: "3", 
    name: "João Silva", 
    email: "joao@example.com", 
    goal: "Resistência cardíaca",
    lastSession: "2023-04-20",
    status: "active",
    progress: "regular"
  },
  { 
    id: "4", 
    name: "Ana Laura", 
    email: "ana@example.com", 
    goal: "Tonificação muscular",
    lastSession: "2023-04-18",
    status: "inactive",
    progress: "needs-attention"
  },
  { 
    id: "5", 
    name: "Pedro Santos", 
    email: "pedro@example.com", 
    goal: "Reabilitação pós-lesão",
    lastSession: "2023-04-15",
    status: "active",
    progress: "good"
  },
];

const Students = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredStudents = studentsData.filter(
    student => student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
               student.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getProgressBadgeClass = (progress: string) => {
    switch (progress) {
      case "excellent":
        return "bg-green-500/20 text-green-500";
      case "good":
        return "bg-primary/20 text-primary";
      case "regular":
        return "bg-yellow-500/20 text-yellow-500";
      case "needs-attention":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  const getProgressText = (progress: string) => {
    switch (progress) {
      case "excellent":
        return "Ótimo";
      case "good":
        return "Bom";
      case "regular":
        return "Regular";
      case "needs-attention":
        return "Atenção";
      default:
        return "Sem dados";
    }
  };
  
  const getInitials = (name: string) => {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Alunos</h1>
            <p className="text-muted-foreground">
              Gerencie seus alunos e acompanhe seus progressos.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Aluno
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Lista de Alunos</CardTitle>
                <CardDescription>Total: {studentsData.length} alunos</CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar alunos..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead className="hidden md:table-cell">Meta</TableHead>
                    <TableHead className="hidden lg:table-cell">Última Sessão</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage alt={student.name} />
                              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground hidden sm:block">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="max-w-[200px] truncate" title={student.goal}>
                            {student.goal}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(student.lastSession).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getProgressBadgeClass(student.progress)}`}
                          >
                            {getProgressText(student.progress)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => navigate(`/alunos/${student.id}`)}
                                  className="cursor-pointer"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Agendar Sessão
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Activity className="h-4 w-4 mr-2" />
                                  Ver Progresso
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Enviar Mensagem
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        <div className="flex flex-col items-center">
                          <p className="text-muted-foreground mb-2">Nenhum aluno encontrado</p>
                          <p className="text-sm text-muted-foreground">Tente ajustar a sua busca</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;
