import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Ruler, Calendar, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeasurementRecord {
  id: string;
  date: string;
  weight: number;
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  neck?: number;
  shoulders?: number;
}

const MeasurementsTable = () => {
  const { toast } = useToast();
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([
    {
      id: "1",
      date: "2024-01-15",
      weight: 75,
      height: 175,
      chest: 95,
      waist: 83,
      hips: 100,
      arms: 32,
      thighs: 55,
    },
  ]);
  
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<MeasurementRecord | null>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    neck: "",
    shoulders: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.weight) {
      toast({
        title: "Erro",
        description: "Data e peso são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newMeasurement: MeasurementRecord = {
      id: editingMeasurement?.id || Date.now().toString(),
      date: formData.date,
      weight: parseFloat(formData.weight),
      height: formData.height ? parseFloat(formData.height) : undefined,
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      hips: formData.hips ? parseFloat(formData.hips) : undefined,
      arms: formData.arms ? parseFloat(formData.arms) : undefined,
      thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
      neck: formData.neck ? parseFloat(formData.neck) : undefined,
      shoulders: formData.shoulders ? parseFloat(formData.shoulders) : undefined,
    };

    if (editingMeasurement) {
      setMeasurements(measurements.map(m => m.id === editingMeasurement.id ? newMeasurement : m));
      toast({
        title: "Medida atualizada",
        description: "As medidas foram atualizadas com sucesso.",
      });
    } else {
      setMeasurements([...measurements, newMeasurement]);
      toast({
        title: "Medida adicionada",
        description: "Nova medida corporal registrada.",
      });
    }

    resetForm();
  };

  const handleEdit = (measurement: MeasurementRecord) => {
    setFormData({
      date: measurement.date,
      weight: measurement.weight.toString(),
      height: measurement.height?.toString() || "",
      chest: measurement.chest?.toString() || "",
      waist: measurement.waist?.toString() || "",
      hips: measurement.hips?.toString() || "",
      arms: measurement.arms?.toString() || "",
      thighs: measurement.thighs?.toString() || "",
      neck: measurement.neck?.toString() || "",
      shoulders: measurement.shoulders?.toString() || "",
    });
    setEditingMeasurement(measurement);
    setIsAddingMeasurement(true);
  };

  const handleDelete = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id));
    toast({
      title: "Medida removida",
      description: "O registro foi removido com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: "",
      height: "",
      chest: "",
      waist: "",
      hips: "",
      arms: "",
      thighs: "",
      neck: "",
      shoulders: "",
    });
    setIsAddingMeasurement(false);
    setEditingMeasurement(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Registro de Medidas Corporais
              </CardTitle>
              <CardDescription>
                Acompanhe a evolução das suas medidas corporais ao longo do tempo
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingMeasurement(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Medição
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {measurements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-center">Peso (kg)</TableHead>
                  <TableHead className="text-center">Altura (cm)</TableHead>
                  <TableHead className="text-center">Peito (cm)</TableHead>
                  <TableHead className="text-center">Cintura (cm)</TableHead>
                  <TableHead className="text-center">Quadril (cm)</TableHead>
                  <TableHead className="text-center">Braços (cm)</TableHead>
                  <TableHead className="text-center">Coxas (cm)</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((measurement) => (
                    <TableRow key={measurement.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(measurement.date)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {measurement.weight} kg
                      </TableCell>
                      <TableCell className="text-center">
                        {measurement.height ? `${measurement.height} cm` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {measurement.chest ? `${measurement.chest} cm` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {measurement.waist ? `${measurement.waist} cm` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {measurement.hips ? `${measurement.hips} cm` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {measurement.arms ? `${measurement.arms} cm` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {measurement.thighs ? `${measurement.thighs} cm` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(measurement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(measurement.id)}
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
              <Ruler className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma medida registrada ainda.
              </p>
              <Button 
                onClick={() => setIsAddingMeasurement(true)} 
                className="mt-4"
              >
                Registrar Primeira Medição
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Measurement Dialog */}
      <Dialog open={isAddingMeasurement} onOpenChange={setIsAddingMeasurement}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMeasurement ? "Editar Medição" : "Nova Medição"}
            </DialogTitle>
            <DialogDescription>
              {editingMeasurement 
                ? "Edite os dados da medição selecionada"
                : "Registre suas medidas corporais atuais"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="75.5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="175"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chest">Peito (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  step="0.1"
                  min="50"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  placeholder="95"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waist">Cintura (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  min="50"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  placeholder="83"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hips">Quadril (cm)</Label>
                <Input
                  id="hips"
                  type="number"
                  step="0.1"
                  min="50"
                  value={formData.hips}
                  onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arms">Braços (cm)</Label>
                <Input
                  id="arms"
                  type="number"
                  step="0.1"
                  min="20"
                  value={formData.arms}
                  onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                  placeholder="32"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thighs">Coxas (cm)</Label>
                <Input
                  id="thighs"
                  type="number"
                  step="0.1"
                  min="30"
                  value={formData.thighs}
                  onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                  placeholder="55"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neck">Pescoço (cm)</Label>
                <Input
                  id="neck"
                  type="number"
                  step="0.1"
                  min="25"
                  value={formData.neck}
                  onChange={(e) => setFormData({ ...formData, neck: e.target.value })}
                  placeholder="38"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shoulders">Ombros (cm)</Label>
                <Input
                  id="shoulders"
                  type="number"
                  step="0.1"
                  min="80"
                  value={formData.shoulders}
                  onChange={(e) => setFormData({ ...formData, shoulders: e.target.value })}
                  placeholder="110"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingMeasurement ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeasurementsTable;