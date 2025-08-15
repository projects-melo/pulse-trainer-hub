import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Objective } from "@/types";
import { Plus, Target } from "lucide-react";

export const ObjectiveManager = () => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [userObjectives, setUserObjectives] = useState<Objective[]>([]);
  const [newObjectiveName, setNewObjectiveName] = useState("");
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const token = localStorage.getItem("fitpulse-token");

  useEffect(() => {
    if (token) {
      loadObjectives();
      loadUserObjectives();
    }
  }, [token]);

  const loadObjectives = async () => {
    try {
      if (!token) return;
      const data = await api.getAllObjectives(token);
      setObjectives(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao carregar objetivos",
        variant: "destructive"
      });
    }
  };

  const loadUserObjectives = async () => {
    try {
      if (!token) return;
      const data = await api.getUserObjectives(token);
      setUserObjectives(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao carregar seus objetivos",
        variant: "destructive"
      });
    }
  };

  const createObjective = async () => {
    if (!newObjectiveName.trim() || !token) return;
    
    try {
      setLoading(true);
      await api.createObjective(token, newObjectiveName);
      setNewObjectiveName("");
      
      toast({
        title: "Sucesso",
        description: "Objetivo criado com sucesso!"
      });
      
      await loadObjectives();
      await loadUserObjectives();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar objetivo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const linkObjectives = async () => {
    if (selectedObjectives.length === 0 || !token) return;
    
    try {
      setLoading(true);
      await api.linkObjectiveToUser(token, selectedObjectives);
      setSelectedObjectives([]);
      
      toast({
        title: "Sucesso",
        description: "Objetivos vinculados com sucesso!"
      });
      
      await loadUserObjectives();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao vincular objetivos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleObjectiveToggle = (objectiveId: number) => {
    setSelectedObjectives(prev => 
      prev.includes(objectiveId)
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Criar Novo Objetivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Objetivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="objective-name">Nome do Objetivo</Label>
            <Input
              id="objective-name"
              value={newObjectiveName}
              onChange={(e) => setNewObjectiveName(e.target.value)}
              placeholder="Ex: Perder peso, Ganhar massa muscular..."
            />
          </div>
          <Button 
            onClick={createObjective} 
            disabled={loading || !newObjectiveName.trim()}
            className="w-full"
          >
            {loading ? "Criando..." : "Criar Objetivo"}
          </Button>
        </CardContent>
      </Card>

      {/* Meus Objetivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Meus Objetivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userObjectives.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Você ainda não possui objetivos vinculados.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userObjectives.map((objective) => (
                <Badge key={objective.id} variant="default">
                  {objective.nome}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vincular Objetivos Existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Vincular Objetivos Existentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {objectives.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum objetivo disponível.
            </p>
          ) : (
            <>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {objectives.map((objective) => {
                  const isUserObjective = userObjectives.some(uo => uo.id === objective.id);
                  return (
                    <div 
                      key={objective.id} 
                      className="flex items-center space-x-2 p-2 rounded border"
                    >
                      <Checkbox
                        id={`objective-${objective.id}`}
                        checked={selectedObjectives.includes(objective.id)}
                        onCheckedChange={() => handleObjectiveToggle(objective.id)}
                        disabled={isUserObjective}
                      />
                      <Label 
                        htmlFor={`objective-${objective.id}`}
                        className={`flex-1 ${isUserObjective ? 'text-muted-foreground' : ''}`}
                      >
                        {objective.nome}
                        {isUserObjective && (
                          <Badge variant="secondary" className="ml-2">
                            Já vinculado
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </div>
              
              {selectedObjectives.length > 0 && (
                <Button 
                  onClick={linkObjectives}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Vinculando..." : `Vincular ${selectedObjectives.length} objetivo(s)`}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};