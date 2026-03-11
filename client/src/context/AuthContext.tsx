import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../service/apiService';

interface User {
  _id: string;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  fetchUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Lấy thông tin user từ API
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        return
      }
      const userData = await getCurrentUser(token)
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user info:', error)
      setUser(null)
    }
  }

  // Check token và lấy user info khi component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          setIsAuthenticated(true)
          await fetchUserInfo()
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async () => {
    setIsAuthenticated(true)
    // Lấy user info sau khi login
    await fetchUserInfo()
  };

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider