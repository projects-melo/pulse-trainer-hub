
import { RegisterData, User, AdditionalUserData } from "@/types";

const API_URL = "http://34.207.174.233:7777";

export const api = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha ao realizar login");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha ao realizar cadastro");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      throw error;
    }
  },

  // Simulação - Na versão real, isso chamaria um endpoint para atualizar o perfil
  updateUserProfile: async (userId: string, additionalData: AdditionalUserData): Promise<User> => {
    try {
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Em uma implementação real, aqui faria uma chamada para o backend
      // const response = await fetch(`${API_URL}/user/${userId}`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(additionalData),
      // });
      
      // Simulando o usuário atualizado
      const storedUser = localStorage.getItem("fitpulse-user");
      if (!storedUser) {
        throw new Error("Usuário não encontrado");
      }
      
      const user: User = JSON.parse(storedUser);
      const updatedUser = { ...user, ...additionalData };
      
      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },
};
