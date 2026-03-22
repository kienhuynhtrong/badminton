import { createContext, useContext, useEffect, useState } from 'react'
import { clearStoredToken, getCurrentUser, type User } from '../service/apiService'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: () => Promise<void>
  logout: () => void
  loading: boolean
  fetchUserInfo: () => Promise<void>
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

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setUser(null)
        setIsAuthenticated(false)
        return
      }

      const userData = await getCurrentUser(token)

      if (!userData) {
        clearStoredToken()
        setUser(null)
        setIsAuthenticated(false)
        return
      }

      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error fetching user info:', error)
      clearStoredToken()
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserInfo()
      } catch (error) {
        console.error('Error initializing auth:', error)
        clearStoredToken()
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    void initAuth()
  }, [])

  const login = async () => {
    await fetchUserInfo()
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    clearStoredToken()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
