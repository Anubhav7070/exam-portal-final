// API service for communicating with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signup(data: SignupData): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Exam methods
  async getExams(): Promise<any[]> {
    return this.request<any[]>('/exams');
  }

  async getExam(id: string): Promise<any> {
    return this.request<any>(`/exams/${id}`);
  }

  async submitExam(examId: string, answers: any[]): Promise<any> {
    return this.request<any>(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // Results methods
  async getUserResults(userId: string): Promise<any[]> {
    return this.request<any[]>(`/results/${userId}`);
  }

  async sendVerificationOTP(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/send-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async sendLoginOTP(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyLoginOTP(email: string, code: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/auth/user/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/auth/users');
  }

  async updateUser(userId: string, data: Partial<User>): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/auth/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async toggleUserActive(userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/auth/user/${userId}/active`, {
      method: 'PATCH',
    });
  }

  async changeUserRole(userId: string, role: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/auth/user/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async triggerPasswordReset(userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/auth/user/${userId}/reset-password`, {
      method: 'POST',
    });
  }

  // Forgot password (OTP) flow
  async triggerPasswordResetByEmail(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyPasswordResetOtp(email: string, code: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    });
  }
}

export const apiService = new ApiService(); 