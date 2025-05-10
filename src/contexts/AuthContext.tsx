
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, RegisterData, User, AdditionalUserData } from "@/types";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState<RegisterData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há um usuário no localStorage
    const storedUser = localStorage.getItem("fitpulse-user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error);
        localStorage.removeItem("fitpulse-user");
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await api.login(email, password);
      
      // Store the token separately if needed
      if (userData.token) {
        localStorage.setItem("fitpulse-token", userData.token);
      }
      
      setUser(userData);
      localStorage.setItem("fitpulse-user", JSON.stringify(userData));
      
      const displayName = userData.name || email.split('@')[0];
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a) de volta, ${displayName}!`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao realizar login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Store registration data and navigate to complete registration
      setRegistrationData(userData);
      
      // Create minimal user data to display in the complete registration page
      const minimalUser: User = {
        id: "temp-id",
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date(),
      };
      
      // Set temporary user to be used in the complete registration page
      setUser(minimalUser);
      
      toast({
        title: "Cadastro iniciado com sucesso",
        description: "Complete seu cadastro com informações adicionais",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar cadastro",
        description: error.message || "Verifique os dados informados e tente novamente",
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeRegistration = async (additionalData: AdditionalUserData) => {
    try {
      setLoading(true);
      if (!user || !registrationData) {
        throw new Error("Dados de registro incompletos");
      }
      
      // Now send the full registration data to the API
      const fullRegistrationData = {
        ...registrationData,
        phone: additionalData.phone || registrationData.phone,
        date_of_birth: additionalData.dateOfBirth ? additionalData.dateOfBirth.toISOString() : registrationData.date_of_birth,
        gender: additionalData.gender || registrationData.gender,
        weight: additionalData.weight,
        height: additionalData.height,
      };
      
      // Call API to register the user with complete data
      const newUser = await api.register(fullRegistrationData);
      
      // Store necessary data from the response
      if (newUser && newUser.token) {
        localStorage.setItem("fitpulse-token", newUser.token);
      }
      
      setUser(newUser);
      localStorage.setItem("fitpulse-user", JSON.stringify(newUser));
      
      // Clear registration data after successful registration
      setRegistrationData(null);
      
      toast({
        title: "Cadastro concluído com sucesso",
        description: "Bem-vindo(a) ao FitPulse!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao completar cadastro",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRegistrationData(null);
    localStorage.removeItem("fitpulse-user");
    localStorage.removeItem("fitpulse-token");
    toast({
      title: "Logout realizado",
      description: "Até a próxima!",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      completeRegistration,
      registrationData,
      setRegistrationData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
