import { RegisterData, User, AdditionalUserData } from "@/types";

const API_URL = "http://localhost:8080";

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
      console.log("Login response:", data);
      
      // If the API only returns a token, create a minimal user object
      if (data.token && !data.user && !data.name) {
        // Use the email from the login request to create a basic user
        return {
          id: "temp-id", // Temporary ID until profile is loaded
          name: email.split('@')[0], // Use part of email as temporary name
          email: email,
          role: "trainer", // Default role, can be updated later
          createdAt: new Date(),
          token: data.token // Store the token
        };
      }
      
      // For APIs that return user data directly or nested
      const userData = data.user || data;
      
      if (!userData) {
        console.error("API response doesn't contain valid user data:", data);
        throw new Error("Dados de usuário inválidos recebidos do servidor");
      }
      
      // Add token to user data if it exists in the response
      if (data.token) {
        userData.token = data.token;
      }

      return userData;
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<User> => {
    try {
      // Now we can use userData directly as it matches the expected API format
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
      return data.user || data;
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
