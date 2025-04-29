
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, RegisterData, User } from "@/types";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      setUser(userData);
      localStorage.setItem("fitpulse-user", JSON.stringify(userData));
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a) de volta, ${userData.name}!`,
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
      setLoading(true);
      const newUser = await api.register(userData);
      setUser(newUser);
      localStorage.setItem("fitpulse-user", JSON.stringify(newUser));
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: `Bem-vindo(a) ao Fit Pulse, ${newUser.name}!`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao realizar cadastro",
        description: error.message || "Verifique os dados informados e tente novamente",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fitpulse-user");
    toast({
      title: "Logout realizado",
      description: "Até a próxima!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
