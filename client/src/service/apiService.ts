const API_BASE_URL = 'http://localhost:8000/api';

interface User {
  _id: string;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Lấy thông tin user đã đăng nhập
export const getCurrentUser = async (token: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};
