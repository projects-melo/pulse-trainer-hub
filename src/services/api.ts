
import { RegisterData, User, AdditionalUserData } from "@/types";

const API_URL = "http://18.231.163.16";

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
      // Prepare the request body according to the new struct format
      const registerPayload = {
        name: userData.name,
        email: userData.email,
        username: userData.email.split('@')[0], // Creating username from email as default
        password: userData.password,
        confirm_password: userData.password,
        role: userData.role,
        status: "active"
      };

      const response = await fetch(`${API_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerPayload),
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

  // Update API to include additional user data
  updateUserProfile: async (userId: string, additionalData: AdditionalUserData): Promise<User> => {
    try {
      // In a real implementation, we would send this data to the backend
      // For now we're still simulating storage locally
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUser = localStorage.getItem("fitpulse-user");
      if (!storedUser) {
        throw new Error("Usuário não encontrado");
      }
      
      const user: User = JSON.parse(storedUser);
      const updatedUser = { ...user, ...additionalData };
      
      // Store the updated user in localStorage
      localStorage.setItem("fitpulse-user", JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },
};
