const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Auth
  async register(name: string, email: string, password: string, passwordConfirmation: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async me() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Games
  async getGames(page: number = 1) {
    return this.request(`/games?page=${page}`);
  }

  async getGame(id: string) {
    return this.request(`/games/${id}`);
  }

  async getGameHistory(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/games/history?${params}`);
  }

  // Cases
  async getCases(difficulty?: number) {
    const params = difficulty ? `?difficulty=${difficulty}` : '';
    return this.request(`/cases${params}`);
  }

  async getCase(id: string) {
    return this.request(`/cases/${id}`);
  }

  // Templates
  async getTemplates(type?: string) {
    const params = type ? `?type=${type}` : '';
    return this.request(`/templates${params}`);
  }

  async getTemplate(id: string) {
    return this.request(`/templates/${id}`);
  }
}

export const api = new ApiClient();
