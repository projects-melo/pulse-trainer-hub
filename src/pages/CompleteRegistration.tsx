
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader, Calendar as CalendarIcon, Phone, UserRound, Weight, Ruler } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<"day" | "year">("day");

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

      const success = await completeRegistration(additionalData);
      if (success) {
        // Redirecionar para a página de login após o registro bem-sucedido
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao completar seu cadastro. Tente novamente.");
    } finally {
      setIsLoading(false); // Garante que o loading seja removido em caso de erro
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

  // Componente para exibir anos para seleção rápida
  const YearPicker = ({ onChange }: { onChange: (year: number) => void }) => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const years = Array.from({ length: 101 }, (_, i) => startYear + i).reverse();
    
    return (
      <div className="p-3 h-64 overflow-y-auto">
        <div className="grid grid-cols-4 gap-2">
          {years.map(year => (
            <Button
              key={year}
              variant="outline"
              size="sm"
              onClick={() => onChange(year)}
              className="h-8"
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Complete seu cadastro</CardTitle>
            <CardDescription className="text-center">
              {userRole === "student" 
                ? "Informe seus dados pessoais para personalizar sua experiência" 
                : "Informe seus dados profissionais para completar seu cadastro"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
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

              {userRole === "student" ? (
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
                </>
              ) : (
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

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Concluir cadastro"
                )}
              </Button>
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
