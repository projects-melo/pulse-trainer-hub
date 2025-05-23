import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader, Calendar as CalendarIcon, Phone, UserRound, Weight, Ruler } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompleteRegistration = () => {
  const { user, completeRegistration, registrationData } = useAuth();
  const navigate = useNavigate();

  // Redirect if registration data is missing
  useEffect(() => {
    if (!registrationData) {
      navigate("/cadastro");
      return;
    }
  }, [registrationData, navigate]);

  // Initialize form state with registration data if available
  const [phone, setPhone] = useState(registrationData?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    registrationData?.date_of_birth ? new Date(registrationData.date_of_birth) : undefined
  );
  const [gender, setGender] = useState<string>(registrationData?.gender || "");
  const [weight, setWeight] = useState<string>(registrationData?.weight?.toString() || "");
  const [height, setHeight] = useState<string>(registrationData?.height?.toString() || "");
  const [cref, setCref] = useState<string>(registrationData?.cref || "");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Trainer specific fields for step 3
  const [college, setCollege] = useState("");
  const [graduationDate, setGraduationDate] = useState<Date | undefined>(undefined);
  const [experienceDuration, setExperienceDuration] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [primarySpecialty, setPrimarySpecialty] = useState("");
  const [certifications, setCertifications] = useState("");
  const [bio, setBio] = useState("");

  // Get the role from registrationData since user might not be fully set yet
  const userRole = user?.role || registrationData?.role || "student";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Basic form validation
      if (userRole === "student") {
        if (weight && Number(weight) > 999.99) {
          throw new Error("Peso não pode exceder 999.99 kg");
        }
        
        if (height && Number(height) > 300) {
          throw new Error("Altura não pode exceder 300 cm");
        }
      }

      const additionalData = {
        phone,
        dateOfBirth,
        gender,
        ...(userRole === "student" ? {
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
        } : {
          cref,
        }),
      };

      // For trainers, if we are on step 2, just advance to step 3
      if (userRole === "trainer" && step === 2) {
        setStep(3);
        setIsLoading(false);
        return;
      }

      // If trainer and on final step, send additional trainer data
      if (userRole === "trainer" && step === 3) {
        if (!graduationDate) {
          throw new Error("Por favor, informe a data de formação");
        }

        // Format graduation date to ISO string for API
        const gradDateString = graduationDate.toISOString().split('T')[0];

        // Send trainer specific data to the API
        const response = await fetch("http://localhost:8080/trainer/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token || localStorage.getItem("fitpulse-token")}`
          },
          body: JSON.stringify({
            cref,
            college,
            graduation_date: gradDateString,
            experience_duration: experienceDuration,
            specialty,
            certifications,
            primary_specialty: primarySpecialty,
            bio
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Erro ao registrar dados do treinador");
        }
      }

      // Complete the registration for both roles
      const success = await completeRegistration(additionalData);
      if (success) {
        // Redirecionar para a página de login após o registro bem-sucedido
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao completar seu cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format phone number (BR format)
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let formatted = digits;
    
    if (digits.length > 0) {
      if (digits.length <= 2) {
        formatted = `+${digits}`;
      } else if (digits.length <= 4) {
        formatted = `+${digits.slice(0, 2)}${digits.slice(2)}`;
      } else if (digits.length <= 9) {
        formatted = `+${digits.slice(0, 2)}${digits.slice(2, 7)}`;
      } else {
        formatted = `+${digits.slice(0, 2)}${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  // If redirecting, show a loading spinner
  if (!registrationData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Render different content based on current step
  const renderStepContent = () => {
    if (userRole === "trainer" && step === 3) {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="cref">Número do CREF</Label>
            <Input
              id="cref"
              type="text"
              placeholder="Exemplo: 123456-G/SP"
              value={cref}
              onChange={(e) => setCref(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="college">Nome da Faculdade</Label>
            <Input
              id="college"
              type="text"
              placeholder="Universidade onde você se formou"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="graduationDate" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Data de Formação
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="graduationDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    !graduationDate && "text-muted-foreground"
                  )}
                >
                  {graduationDate
                    ? format(graduationDate, "dd/MM/yyyy", { locale: pt })
                    : "Selecione a data"}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={graduationDate}
                  onSelect={setGraduationDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1970}
                  toYear={new Date().getFullYear()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experienceDuration">Tempo de Experiência</Label>
            <Input
              id="experienceDuration"
              type="text"
              placeholder="Exemplo: 5 years"
              value={experienceDuration}
              onChange={(e) => setExperienceDuration(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primarySpecialty">Especialidade Principal</Label>
            <Input
              id="primarySpecialty"
              type="text"
              placeholder="Exemplo: Musculação"
              value={primarySpecialty}
              onChange={(e) => setPrimarySpecialty(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidades</Label>
            <Input
              id="specialty"
              type="text"
              placeholder="Exemplo: Musculação e Treinamento Funcional"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certifications">Certificações</Label>
            <Input
              id="certifications"
              type="text"
              placeholder="Exemplo: Certificação XYZ, Curso ABC"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <textarea
              id="bio"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Escreva sobre sua experiência, objetivos como personal trainer, etc."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>
        </>
      );
    }
    
    // Step 1 for both roles (basic info)
    if (step === 1) {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="+5511999999999"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={16}
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
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                >
                  {dateOfBirth
                    ? format(dateOfBirth, "dd/MM/yyyy", { locale: pt })
                    : "Selecione a data"}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  className="p-3 pointer-events-auto"
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
        </>
      );
    }
    
    // Step 2 for both roles (weight and height)
    return (
      <>
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
            max="999.99"
            placeholder="Exemplo: 70.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Máximo: 999.99 kg</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Altura (cm)
          </Label>
          <Input
            id="height"
            type="number"
            step="1"
            min="100"
            max="300"
            placeholder="Exemplo: 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Em centímetros. Máximo: 300 cm</p>
        </div>

        {userRole === "trainer" && (
          <div className="space-y-2">
            <Label htmlFor="cref">Número do CREF</Label>
            <Input
              id="cref"
              type="text"
              placeholder="Exemplo: 123456-G/SP"
              value={cref}
              onChange={(e) => setCref(e.target.value)}
              required
            />
          </div>
        )}
      </>
    );
  };

  const handleNextStep = () => {
    setStep(currentStep => currentStep + 1);
  };

  const handlePreviousStep = () => {
    setStep(currentStep => Math.max(1, currentStep - 1));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Complete seu cadastro
              {step > 1 && ` (Passo ${step}${userRole === "trainer" ? "/3" : "/2"})`}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? "Informe seus dados pessoais para personalizar sua experiência"
                : step === 2
                  ? "Informe seus dados biométricos"
                  : "Informe seus dados profissionais"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderStepContent()}

              <div className="flex justify-between">
                {step > 1 && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={isLoading}
                  >
                    Voltar
                  </Button>
                )}
                
                <Button 
                  type={step === 1 || (userRole === "trainer" && step < 3) ? "button" : "submit"}
                  className={step === 1 || (userRole === "trainer" && step < 3) ? "ml-auto" : "w-full"}
                  disabled={isLoading}
                  onClick={step === 1 || (userRole === "trainer" && step < 3) ? handleNextStep : undefined}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : step === 1 || (userRole === "trainer" && step < 3) ? (
                    "Próximo"
                  ) : (
                    "Concluir cadastro"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-muted-foreground">
              Todos os campos podem ser editados posteriormente no seu perfil.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CompleteRegistration;
