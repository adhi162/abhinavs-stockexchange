// API Client for backend communication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: response.statusText,
        }));
        throw {
          message: errorData.error || errorData.message || 'Request failed',
          status: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }
      // Network error or other fetch errors
      throw {
        message: 'Unable to connect to server. Please ensure the backend is running.',
        status: 0,
      } as ApiError;
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem('admin_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.token || null;
    } catch {
      return null;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const url = API_URL.replace('/api', '/health');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Backend is not available');
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; email: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyMfa(email: string, code: string) {
    return this.request<{ token: string; email: string }>('/auth/mfa/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Admin endpoints
  async getCurrencies() {
    return this.request<Array<{
      id: string;
      code: string;
      name: string;
      commissionRate: string;
      enabled: boolean;
    }>>('/admin/currencies');
  }

  async updateCurrency(id: string, data: { name?: string; commissionRate?: string; enabled?: boolean }) {
    return this.request(`/admin/currencies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createCurrency(data: { code: string; name: string; commissionRate: string }) {
    return this.request('/admin/currencies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRates() {
    return this.request<Array<{
      id: string;
      fromCurrency: string;
      toCurrency: string;
      rate: string;
      changePercent?: string;
      trend?: string;
    }>>('/admin/rates');
  }

  async updateRate(id: string, data: { rate: string }) {
    return this.request(`/admin/rates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUsers() {
    return this.request<Array<{
      id: string;
      email: string;
      createdAt: string;
      lastLogin?: string;
    }>>('/admin/users');
  }

  async createUser(data: { email: string; password: string }) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUserPassword(email: string, currentPassword: string, newPassword: string) {
    return this.request(`/admin/users/${encodeURIComponent(email)}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteUser(email: string) {
    return this.request(`/admin/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });
  }

  async getOfficeLocation() {
    return this.request<{
      street: string;
      city: string;
      postalCode: string;
      mapUrl: string;
    }>('/admin/office-location');
  }

  async updateOfficeLocation(data: {
    street: string;
    city: string;
    postalCode: string;
    mapUrl: string;
  }) {
    return this.request('/admin/office-location', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getSettings() {
    return this.request<{
      defaultCommission: string;
    }>('/admin/settings');
  }

  async updateSettings(data: { defaultCommission: string }) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;

