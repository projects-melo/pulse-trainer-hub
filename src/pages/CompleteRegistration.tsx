
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
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [cref, setCref] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<"day" | "month" | "year">("month");

  // Get the role from registrationData since user might not be fully set yet
  const userRole = user?.role || registrationData?.role || "student";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
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

      await completeRegistration(additionalData);
      navigate("/dashboard");
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
        formatted = `+55${digits}`;
      } else if (digits.length <= 4) {
        formatted = `+55${digits.slice(0, 2)}${digits.slice(2)}`;
      } else if (digits.length <= 9) {
        formatted = `+55${digits.slice(0, 2)}${digits.slice(2, 7)}`;
      } else {
        formatted = `+55${digits.slice(0, 2)}${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
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

  // Custom calendar header to improve year/month navigation
  const CustomCalendarHeader = ({ 
    month, 
    onPreviousClick, 
    onNextClick,
    onViewChange
  }: { 
    month: Date, 
    onPreviousClick: () => void, 
    onNextClick: () => void,
    onViewChange: (view: "day" | "month" | "year") => void
  }) => {
    return (
      <div className="flex justify-between items-center p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousClick}
          className="h-7 w-7 p-0"
        >
          &lt;
        </Button>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            onClick={() => onViewChange("month")}
            className={`text-sm ${calendarView === "month" ? "font-bold" : ""}`}
          >
            {format(month, "MMM", { locale: pt })}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onViewChange("year")}
            className={`text-sm ${calendarView === "year" ? "font-bold" : ""}`}
          >
            {format(month, "yyyy")}
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextClick}
          className="h-7 w-7 p-0"
        >
          &gt;
        </Button>
      </div>
    );
  };

  // Year selection view
  const YearView = ({
    selectedDate,
    onChange,
  }: {
    selectedDate: Date | undefined,
    onChange: (date: Date) => void,
  }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 120 }, (_, i) => currentYear - i);
    
    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {years.map((year) => (
          <Button
            key={year}
            variant={selectedDate && selectedDate.getFullYear() === year ? "default" : "outline"}
            className="h-9"
            onClick={() => {
              const newDate = new Date(selectedDate || new Date());
              newDate.setFullYear(year);
              onChange(newDate);
              setCalendarView("month");
            }}
          >
            {year}
          </Button>
        ))}
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
                <div className="p-3 text-sm bg-destructive/20 text-destructive rounded-md">
                  {error}
                </div>
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
                    {calendarView === "year" ? (
                      <YearView 
                        selectedDate={dateOfBirth} 
                        onChange={setDateOfBirth} 
                      />
                    ) : (
                      <>
                        <CustomCalendarHeader
                          month={dateOfBirth || new Date()}
                          onPreviousClick={() => {
                            if (calendarView === "month") {
                              const prevMonth = new Date(dateOfBirth || new Date());
                              prevMonth.setMonth(prevMonth.getMonth() - 1);
                              setDateOfBirth(prevMonth);
                            } else {
                              const prevYear = new Date(dateOfBirth || new Date());
                              prevYear.setFullYear(prevYear.getFullYear() - 1);
                              setDateOfBirth(prevYear);
                            }
                          }}
                          onNextClick={() => {
                            if (calendarView === "month") {
                              const nextMonth = new Date(dateOfBirth || new Date());
                              nextMonth.setMonth(nextMonth.getMonth() + 1);
                              setDateOfBirth(nextMonth);
                            } else {
                              const nextYear = new Date(dateOfBirth || new Date());
                              nextYear.setFullYear(nextYear.getFullYear() + 1);
                              setDateOfBirth(nextYear);
                            }
                          }}
                          onViewChange={setCalendarView}
                        />
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          showOutsideDays={false}
                        />
                      </>
                    )}
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
                      Altura (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="1"
                      min="100"
                      max="250"
                      placeholder="Exemplo: 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
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
