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

  // Nova função para buscar informações do usuário atual
  getUserProfile: async (token: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Falha ao buscar informações do usuário";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          errorMessage = errorText;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("User profile response:", data);
      
      // Mapear os dados do backend para o formato esperado pelo frontend
      const userData = data.data || data;
      
      // Criar um objeto de usuário seguro com todos os campos necessários
      const safeUser: User = {
        id: userData.id || "temp-id",
        name: userData.name || "",
        email: userData.email || "",
        username: userData.username || "",
        role: userData.role === "personal" ? "trainer" : "student", // Map API response back to our app's roles
        createdAt: userData.created_at ? new Date(userData.created_at) : new Date(),
        token: token,
        phone: userData.phone,
        gender: userData.gender,
        dateOfBirth: userData.date_of_birth ? new Date(userData.date_of_birth) : undefined,
        weight: userData.weight,
        height: userData.height ? Number(userData.height) * 100 : undefined, // Converter de metros para cm
        cref: userData.cref,
        avatar: userData.avatar,
        status: userData.status
      };
      
      return safeUser;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      throw error;
    }
  },

  // Nova função para fazer upload de avatar
  uploadAvatar: async (token: string, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_URL}/user/upload`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Falha ao fazer upload da imagem";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          errorMessage = errorText;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Avatar upload response:", data);
      
      // Retornar a URL da imagem ou um identificador de sucesso
      return data.avatar_url || data.message || "Upload realizado com sucesso";
    } catch (error) {
      console.error("Erro ao fazer upload de avatar:", error);
      throw error;
    }
  }
};
