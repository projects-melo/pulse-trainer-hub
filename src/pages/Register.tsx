
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Loader, Calendar as CalendarIcon, Phone, UserRound, Weight, Ruler } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Campos básicos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"trainer" | "student">("student");
  
  // Campos adicionais
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState<string>("M");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formatar o telefone
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let formatted = digits;
    
    if (digits.length > 0) {
      formatted = `+55${digits}`;
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      const formattedDate = dateOfBirth ? dateOfBirth.toISOString() : "";
      
      await register({
        name,
        email,
        username,
        password,
        confirm_password: confirmPassword,
        phone,
        date_of_birth: formattedDate,
        gender,
        role,
        status: "active",
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
      });
      
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao realizar o cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Cadastro</CardTitle>
            <CardDescription className="text-center">
              Crie sua conta no FitPulse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" onValueChange={(value) => setRole(value as "trainer" | "student")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Aluno</TabsTrigger>
                <TabsTrigger value="trainer">Personal Trainer</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm bg-destructive/20 text-destructive rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="seunome"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="+5599999999999"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Data de nascimento
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="dateOfBirth"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          {dateOfBirth ? (
                            format(dateOfBirth, "dd 'de' MMMM 'de' yyyy", { locale: pt })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      Gênero
                    </Label>
                    <RadioGroup 
                      value={gender} 
                      onValueChange={setGender}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="masculino" />
                        <Label htmlFor="masculino">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="feminino" />
                        <Label htmlFor="feminino">Feminino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="O" id="outro" />
                        <Label htmlFor="outro">Outro</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="h-4 w-4" />
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      placeholder="Exemplo: 70.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Altura (m)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      min="1"
                      max="2.5"
                      placeholder="Exemplo: 1.75"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar como Aluno"
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="trainer">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm bg-destructive/20 text-destructive rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerName">Nome completo</Label>
                    <Input
                      id="trainerName"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerEmail">Email</Label>
                    <Input
                      id="trainerEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerUsername">Nome de usuário</Label>
                    <Input
                      id="trainerUsername"
                      type="text"
                      placeholder="seunome"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <Input
                      id="trainerPhone"
                      type="text"
                      placeholder="+5599999999999"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerDateOfBirth" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Data de nascimento
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="trainerDateOfBirth"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          {dateOfBirth ? (
                            format(dateOfBirth, "dd 'de' MMMM 'de' yyyy", { locale: pt })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      Gênero
                    </Label>
                    <RadioGroup 
                      value={gender} 
                      onValueChange={setGender}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="trainerMasculino" />
                        <Label htmlFor="trainerMasculino">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="trainerFeminino" />
                        <Label htmlFor="trainerFeminino">Feminino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="O" id="trainerOutro" />
                        <Label htmlFor="trainerOutro">Outro</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerPassword">Senha</Label>
                    <Input
                      id="trainerPassword"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerConfirmPassword">Confirmar senha</Label>
                    <Input
                      id="trainerConfirmPassword"
                      type="password"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar como Personal Trainer"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
