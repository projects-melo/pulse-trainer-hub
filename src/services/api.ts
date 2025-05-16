
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
        // Tenta obter a mensagem de erro do servidor
        const errorText = await response.text();
        let errorMessage = "Falha ao realizar login";
        
        try {
          // Tenta converter para JSON se possível
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          // Se não for JSON, usa o texto como está
          errorMessage = errorText;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Login response:", data);
      
      // If the API only returns a token, create a minimal user object
      if (data.token && (!data.user && !data.name)) {
        // Use the email from the login request to create a basic user
        return {
          id: "temp-id", // Temporary ID until profile is loaded
          name: data.name, // Use part of email as temporary name
          username: data.username,
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

      // Ensure all required user properties exist
      const safeUser: User = {
        id: userData.id || "temp-id",
        name: userData.name || email.split('@')[0],
        email: userData.email || email,
        username: userData.username || null,
        role: userData.role || "trainer",
        createdAt: userData.createdAt || new Date(),
        token: userData.token || null
      };

      return safeUser;
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<User> => {
    try {
      console.log("Sending complete registration data to API:", userData);
      
      // Format the data for the API
      const apiData = {
        ...userData,
        role: userData.role === "trainer" ? "personal" : "student", // Map "trainer" to "personal" for API
      };
      
      // Format weight and height values according to database constraints
      if (apiData.weight !== undefined && apiData.weight !== null) {
        // Ensure weight is within the numeric(5,2) range
        if (apiData.weight > 999.99) {
          throw new Error("Peso não pode exceder 999.99 kg");
        }
      }

      if (apiData.height !== undefined && apiData.height !== null) {
        // Convert height from cm to meters for the numeric(3,2) field
        apiData.height = Number((apiData.height / 100).toFixed(2));
        
        // Ensure height is within the numeric(3,2) range
        if (apiData.height > 9.99) {
          throw new Error("Altura não pode exceder 9.99 metros");
        }
      }
      
      // Send the complete registration data to the API
      const response = await fetch(`${API_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        // Tenta obter a mensagem de erro do servidor
        const errorText = await response.text();
        let errorMessage = "Falha ao realizar cadastro";
        
        try {
          // Tenta converter para JSON se possível
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          // Se não for JSON, usa o texto como está
          errorMessage = errorText || "Falha ao realizar cadastro";
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Registration response:", data);
      
      // If registration is successful but no user data is returned, create basic user
      if (!data.user && !data) {
        return {
          id: "temp-id", 
          name: userData.name || userData.email.split('@')[0],
          username: userData.username,
          email: userData.email,
          role: userData.role,
          createdAt: new Date(),
        };
      }
      
      const registeredUser = data.user || data;
      
      // Create safe user with fallbacks for all required fields
      const safeUser: User = {
        id: registeredUser.id || "temp-id",
        name: registeredUser.name || userData.name || userData.email.split('@')[0],
        email: registeredUser.email || userData.email,
        username: registeredUser.username || userData.username || null,
        role: registeredUser.role === "personal" ? "trainer" : "student", // Map API response back to our app's roles
        createdAt: registeredUser.createdAt || new Date(),
        token: registeredUser.token || null
      };
      
      return safeUser;
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      throw error;
    }
  },

  // This function is not used in the updated flow, but we'll keep it for potential future use
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
