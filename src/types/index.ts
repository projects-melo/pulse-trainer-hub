
export interface User {
  id: string;
  name: string;
  email: string;
  role: "trainer" | "student";
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  createdAt: Date;
  username?: string;
  status?: string;
  token?: string; // Added token field
}

export interface Trainer extends User {
  role: "trainer";
  specialties: string[];
  experience: string;
  availability: Availability[];
  bio: string;
  students: Student[];
  cref?: string; // Número de registro no Conselho Regional de Educação Física
}

export interface Student extends User {
  role: "student";
  goals: string[];
  healthInfo: HealthInfo;
  progress: Progress[];
  trainer?: string; // Trainer ID
  trainingPlan?: string;
  weight?: number;
  height?: number;
}

export interface Availability {
  dayOfWeek: number; // 0 = domingo, 6 = sábado
  startTime: string; // formato "HH:MM"
  endTime: string; // formato "HH:MM"
}

export interface HealthInfo {
  weight?: number;
  height?: number;
  bmi?: number;
  medicalConditions?: string[];
  allergies?: string[];
}

export interface Progress {
  date: Date;
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
  };
  performanceTests?: {
    name: string;
    result: number;
    unit: string;
  }[];
}

export interface Session {
  id: string;
  trainerId: string;
  studentId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "canceled";
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  completeRegistration: (additionalData: AdditionalUserData) => Promise<boolean>;
  registrationData: RegisterData | null; // Added to store registration data
  setRegistrationData: (data: RegisterData | null) => void; // Added to set registration data
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  role: "trainer" | "student";
  status: string;
  weight?: number;
  height?: number;
  cref?: string; // Added missing cref property
}

export interface AdditionalUserData {
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  weight?: number;
  height?: number;
  cref?: string;
  avatar?: string;
  status?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  trainerId: string;
  studentId: string;
  exercises: Exercise[];
  startDate: Date;
  endDate?: Date;
  frequency: string[];
  status: "active" | "completed" | "paused";
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number; // segundos
  notes?: string;
  videoUrl?: string;
  muscleGroup: string;
}
