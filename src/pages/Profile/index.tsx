
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { api } from "@/services/api";
import { toast } from "sonner";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Shield,
  Clock,
  Award,
  Settings,
  Save,
  Upload,
  Lock,
  Plus,
  Loader,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const isTrainer = user?.role === "trainer";

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.token) {
        try {
          setIsLoading(true);
          const userData = await api.getUserProfile(user.token);
          
          // Se for trainer, montar os dados fictícios complementares
          if (userData.role === "trainer") {
            setProfileData({
              ...userData,
              specialties: ["Musculação", "HIIT", "Funcional", "Reabilitação"],
              experience: "8 anos",
              bio: "Personal trainer especializado em hipertrofia e emagrecimento, com formação em Educação Física e pós-graduação em Fisiologia do Exercício.",
              certifications: [
                "Bacharelado em Educação Física - USP",
                "Especialização em Treinamento Funcional",
                "Certificação em Nutrição Esportiva",
              ],
              availability: [
                { day: "Segunda", hours: "06:00 - 21:00" },
                { day: "Terça", hours: "06:00 - 21:00" },
                { day: "Quarta", hours: "06:00 - 21:00" },
                { day: "Quinta", hours: "06:00 - 21:00" },
                { day: "Sexta", hours: "06:00 - 19:00" },
                { day: "Sábado", hours: "08:00 - 12:00" },
              ],
              location: userData.address || "São Paulo, SP",
            });
          } else {
            // Se for aluno, montar os dados fictícios complementares
            setProfileData({
              ...userData,
              location: userData.address || "São Paulo, SP", 
              joinDate: userData.createdAt ? format(new Date(userData.createdAt), "dd/MM/yyyy") : "10/01/2023",
              goals: ["Perda de peso", "Tonificação muscular", "Melhora do condicionamento"],
              healthInfo: {
                height: userData.height || 175,
                weight: userData.weight || 75.5,
                allergies: "Nenhuma",
                medicalConditions: "Nenhuma",
                injuries: "Nenhuma",
              },
              trainer: "Ana Silva",
              birthdate: userData.dateOfBirth 
                ? format(new Date(userData.dateOfBirth), "dd/MM/yyyy", { locale: ptBR })
                : "15/05/1990",
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
          toast.error("Não foi possível carregar seu perfil. Tente novamente mais tarde.");
          
          // Se falhar, usar dados fictícios
          const defaultData = isTrainer
            ? {
                name: user?.name || "Nome do Trainer",
                email: user?.email || "email@exemplo.com",
                phone: "(11) 99999-9999",
                location: "São Paulo, SP",
                specialties: ["Musculação", "HIIT", "Funcional"],
                experience: "5 anos",
                bio: "Personal trainer",
                certifications: ["Educação Física"],
                availability: [{ day: "Segunda", hours: "08:00 - 18:00" }],
              }
            : {
                name: user?.name || "Nome do Aluno",
                email: user?.email || "email@exemplo.com",
                phone: "(11) 99999-9999",
                birthdate: "01/01/1990",
                location: "São Paulo, SP",
                joinDate: "01/01/2023",
                goals: ["Perda de peso"],
                healthInfo: {
                  height: 175,
                  weight: 75,
                  allergies: "Nenhuma",
                  medicalConditions: "Nenhuma",
                  injuries: "Nenhuma",
                },
                trainer: "Trainer Padrão",
              };
          
          setProfileData(defaultData);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Função para obter iniciais do nome
  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Função para lidar com upload de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Criar preview da imagem selecionada
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para salvar avatar
  const handleAvatarUpload = async () => {
    if (!avatarFile || !user?.token) return;
    
    try {
      setIsUploading(true);
      const avatarUrl = await api.uploadAvatar(user.token, avatarFile);
      setProfileData((prev: any) => ({ ...prev, avatar: avatarUrl }));
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Falha ao atualizar foto de perfil");
    } finally {
      setIsUploading(false);
      setAvatarFile(null);
    }
  };

  // Se ainda estiver carregando ou profileData for nulo, mostra um spinner
  if (isLoading || !profileData) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || profileData?.avatar || ""} />
                  <AvatarFallback className="text-xl">
                    {getInitials(profileData?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center">
                  <CardTitle className="text-xl">{profileData?.name}</CardTitle>
                  <CardDescription>
                    {isTrainer ? "Personal Trainer" : "Aluno"}
                  </CardDescription>
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Escolher foto
                      </span>
                    </Button>
                  </label>
                  {avatarFile && (
                    <Button 
                      size="sm" 
                      disabled={isUploading}
                      onClick={handleAvatarUpload}
                    >
                      {isUploading ? (
                        <>
                          <Loader className="h-3 w-3 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileData?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileData?.phone || "(11) 99999-9999"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileData?.location}</span>
                </div>
                {!isTrainer && (
                  <>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData?.birthdate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Treinador: {profileData?.trainer}</span>
                    </div>
                  </>
                )}
                {isTrainer && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {profileData?.experience} de experiência
                    </span>
                  </div>
                )}
              </div>

              {isTrainer ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-1">
                    {profileData?.specialties?.map(
                      (specialty: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium mb-2">Objetivos</h3>
                  <div className="flex flex-wrap gap-1">
                    {profileData?.goals?.map((goal: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={isTrainer ? "info" : "personal"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                <TabsTrigger value={isTrainer ? "info" : "personal"}>
                  {isTrainer ? "Informações" : "Dados Pessoais"}
                </TabsTrigger>
                <TabsTrigger value={isTrainer ? "certifications" : "health"}>
                  {isTrainer ? "Certificações" : "Informações de Saúde"}
                </TabsTrigger>
                <TabsTrigger value={isTrainer ? "availability" : "security"}>
                  {isTrainer ? "Disponibilidade" : "Segurança"}
                </TabsTrigger>
              </TabsList>
              
              {isTrainer ? (
                <>
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações Profissionais</CardTitle>
                        <CardDescription>
                          Suas informações como personal trainer
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="bio">Biografia</Label>
                          <Textarea
                            id="bio"
                            placeholder="Fale sobre sua experiência e abordagem como treinador"
                            className="mt-1"
                            defaultValue={profileData?.bio || ""}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="experience">Anos de Experiência</Label>
                            <Input
                              id="experience"
                              placeholder="Ex: 5 anos"
                              className="mt-1"
                              defaultValue={profileData?.experience || ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="specialty">Especialidade Principal</Label>
                            <Input
                              id="specialty"
                              placeholder="Ex: Musculação"
                              className="mt-1"
                              defaultValue={profileData?.specialties?.[0] || ""}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="specialties">Especialidades</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {profileData?.specialties?.map((specialty: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center bg-secondary rounded-full px-3 py-1"
                              >
                                <span className="text-sm">{specialty}</span>
                                <button className="ml-2 text-muted-foreground hover:text-foreground">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )) || []}
                            <button className="flex items-center gap-1 text-primary text-sm">
                              <Plus className="h-4 w-4" /> Adicionar
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Alterações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="certifications" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Certificações e Formações</CardTitle>
                        <CardDescription>
                          Suas credenciais profissionais
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          {profileData?.certifications?.map(
                            (certification: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 border rounded-md"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Award className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{certification}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Editar
                                </Button>
                              </div>
                            )
                          ) || []}
                        </div>
                        <div className="flex justify-center">
                          <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Certificação
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="availability" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Disponibilidade</CardTitle>
                        <CardDescription>
                          Defina sua disponibilidade para agendamentos
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          {profileData?.availability?.map(
                            (slot: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 border rounded-md"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{slot.day}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {slot.hours}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Editar
                                </Button>
                              </div>
                            )
                          ) || []}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              ) : (
                <>
                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                        <CardDescription>
                          Seus dados cadastrais
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                              id="name"
                              placeholder="Seu nome"
                              className="mt-1"
                              defaultValue={profileData?.name || ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="seu@email.com"
                              className="mt-1"
                              defaultValue={profileData?.email || ""}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              placeholder="(00) 00000-0000"
                              className="mt-1"
                              defaultValue={profileData?.phone || ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="birthdate">Data de Nascimento</Label>
                            <Input
                              id="birthdate"
                              placeholder="dd/mm/aaaa"
                              className="mt-1"
                              defaultValue={profileData?.birthdate || ""}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="location">Endereço</Label>
                          <Input
                            id="location"
                            placeholder="Cidade, Estado"
                            className="mt-1"
                            defaultValue={profileData?.location || ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="goals">Objetivos</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {profileData?.goals?.map(
                              (goal: string, i: number) => (
                                <div
                                  key={i}
                                  className="flex items-center bg-secondary rounded-full px-3 py-1"
                                >
                                  <span className="text-sm">{goal}</span>
                                  <button className="ml-2 text-muted-foreground hover:text-foreground">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )
                            ) || []}
                            <button className="flex items-center gap-1 text-primary text-sm">
                              <Plus className="h-4 w-4" /> Adicionar
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Alterações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="health" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações de Saúde</CardTitle>
                        <CardDescription>
                          Dados relevantes para seu treinamento
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="height">Altura (cm)</Label>
                            <Input
                              id="height"
                              type="number"
                              placeholder="175"
                              className="mt-1"
                              defaultValue={profileData?.healthInfo?.height || ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="weight">Peso (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              placeholder="70"
                              step="0.1"
                              className="mt-1"
                              defaultValue={profileData?.healthInfo?.weight || ""}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="allergies">Alergias</Label>
                          <Input
                            id="allergies"
                            placeholder="Liste suas alergias ou digite 'nenhuma'"
                            className="mt-1"
                            defaultValue={profileData?.healthInfo?.allergies || ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medical">Condições Médicas</Label>
                          <Textarea
                            id="medical"
                            placeholder="Informe condições médicas relevantes para seu treinamento"
                            className="mt-1"
                            defaultValue={profileData?.healthInfo?.medicalConditions || ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="injuries">Lesões Anteriores</Label>
                          <Textarea
                            id="injuries"
                            placeholder="Informe lesões anteriores relevantes para seu treinamento"
                            className="mt-1"
                            defaultValue={profileData?.healthInfo?.injuries || ""}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Alterações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Segurança da Conta</CardTitle>
                        <CardDescription>
                          Gerencie sua senha e configurações de segurança
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Senha Atual</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="********"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">Nova Senha</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="********"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="********"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button>
                            <Lock className="h-4 w-4 mr-2" />
                            Alterar Senha
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
