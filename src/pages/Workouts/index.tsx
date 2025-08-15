import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Dumbbell, Play, Trash2, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  videoUrl?: string;
  notes?: string;
}

const WorkoutsPage = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    sets: "",
    reps: "",
    videoUrl: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sets || !formData.reps) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: editingExercise?.id || Date.now().toString(),
      name: formData.name,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      videoUrl: formData.videoUrl || undefined,
      notes: formData.notes || undefined,
    };

    if (editingExercise) {
      setExercises(exercises.map(ex => ex.id === editingExercise.id ? newExercise : ex));
      toast({
        title: "Exercício atualizado",
        description: "O exercício foi atualizado com sucesso.",
      });
    } else {
      setExercises([...exercises, newExercise]);
      toast({
        title: "Exercício adicionado",
        description: "O exercício foi adicionado ao treino.",
      });
    }

    // Reset form
    setFormData({ name: "", sets: "", reps: "", videoUrl: "", notes: "" });
    setIsAddingExercise(false);
    setEditingExercise(null);
  };

  const handleEdit = (exercise: Exercise) => {
    setFormData({
      name: exercise.name,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      videoUrl: exercise.videoUrl || "",
      notes: exercise.notes || "",
    });
    setEditingExercise(exercise);
    setIsAddingExercise(true);
  };

  const handleDelete = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
    toast({
      title: "Exercício removido",
      description: "O exercício foi removido do treino.",
    });
  };

  const resetForm = () => {
    setFormData({ name: "", sets: "", reps: "", videoUrl: "", notes: "" });
    setIsAddingExercise(false);
    setEditingExercise(null);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cadastro de Treinos</h1>
            <p className="text-muted-foreground">
              Gerencie e organize seus exercícios e treinos
            </p>
          </div>
          <Button onClick={() => setIsAddingExercise(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Exercício
          </Button>
        </div>

        <Tabs defaultValue="exercises">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exercises">Lista de Exercícios</TabsTrigger>
            <TabsTrigger value="workouts">Treinos Salvos</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Exercícios Cadastrados
                </CardTitle>
                <CardDescription>
                  Lista de todos os exercícios do seu treino
                </CardDescription>
              </CardHeader>
              <CardContent>
                {exercises.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome do Exercício</TableHead>
                        <TableHead className="text-center">Séries</TableHead>
                        <TableHead className="text-center">Repetições</TableHead>
                        <TableHead className="text-center">Vídeo</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exercises.map((exercise) => (
                        <TableRow key={exercise.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{exercise.name}</p>
                              {exercise.notes && (
                                <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{exercise.sets}</TableCell>
                          <TableCell className="text-center">{exercise.reps}</TableCell>
                          <TableCell className="text-center">
                            {exercise.videoUrl ? (
                              <Button variant="outline" size="sm" asChild>
                                <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer">
                                  <Play className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(exercise)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(exercise.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum exercício cadastrado ainda.
                    </p>
                    <Button 
                      onClick={() => setIsAddingExercise(true)} 
                      className="mt-4"
                    >
                      Adicionar Primeiro Exercício
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Treinos Salvos</CardTitle>
                <CardDescription>
                  Seus treinos organizados e salvos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento. Em breve você poderá salvar e organizar treinos completos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Exercise Dialog */}
        <Dialog open={isAddingExercise} onOpenChange={setIsAddingExercise}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingExercise ? "Editar Exercício" : "Adicionar Exercício"}
              </DialogTitle>
              <DialogDescription>
                {editingExercise 
                  ? "Edite as informações do exercício"
                  : "Adicione um novo exercício ao seu treino"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Exercício *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Supino reto com barra"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sets">Séries *</Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    placeholder="3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Repetições *</Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    placeholder="12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo (opcional)</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre execução, peso, etc."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingExercise ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WorkoutsPage;