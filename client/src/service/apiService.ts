const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  status?: string;
  message?: string;
  data?: T;
}

export interface User {
  _id: string;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiRequestOptions extends RequestInit {
  useAuthToken?: boolean;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { useAuthToken = true, headers, body, ...restOptions } = options;
  const token = localStorage.getItem('token');

  const finalHeaders: Record<string, string> = {
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(headers as Record<string, string> || {})
  };

  if (useAuthToken && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    body,
    headers: finalHeaders
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }

  return (json as ApiResponse<T>).data as T;
};

// Lấy thông tin user đã đăng nhập
export const getCurrentUser = async (token: string): Promise<User | null> => {
  try {
    const user = await apiRequest<User>('/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      useAuthToken: false
    });
    return user || null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const getUsers = async (): Promise<User[]> => {
  return apiRequest<User[]>('/users', {
    method: 'GET'
  });
};
