import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await api.get(endpoint);
    const data = response.data;

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return { data };
  } catch (error) {
    return { error: error.message };
  }
}

// Auth API
export const authApi = {
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (credentials: any) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

// Accounts API
export const accountsApi = {
  getAll: () => fetchApi('/accounts'),
  getOne: (id: string) => fetchApi(`/accounts/${id}`),
  create: (data: { type: 'Standard' | 'Smart' | 'You' | 'Metal' }) =>
    fetchApi('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { type: 'Standard' | 'Smart' | 'You' | 'Metal' }) =>
    fetchApi(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Transactions API
export const transactionsApi = {
  getAll: () => fetchApi('/transactions'),
  getByAccount: (accountId: string) =>
    fetchApi(`/transactions/account/${accountId}`),
  create: (data: {
    amount: number;
    type: 'Credit' | 'Debit';
    description?: string;
    accountId: string;
  }) =>
    fetchApi('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default api; 