const DEFAULT_API_BASE_URL = 'http://localhost:8000/api'

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '')
const normalizeEndpoint = (endpoint: string) => (endpoint.startsWith('/') ? endpoint : `/${endpoint}`)

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL)

interface ApiResponse<T> {
  status?: string
  message?: string
  data?: T
}

export interface User {
  _id: string
  username: string
  nickname: string
  email: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  nickname: string
  email: string
  phone?: string
  password: string
}

interface ApiRequestOptions extends RequestInit {
  useAuthToken?: boolean
}

const parseJsonSafe = async (response: Response) => {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

export const setStoredToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const clearStoredToken = () => {
  localStorage.removeItem('token')
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { useAuthToken = true, headers, body, ...restOptions } = options
  const token = localStorage.getItem('token')

  const finalHeaders: Record<string, string> = {
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...((headers as Record<string, string>) || {}),
  }

  if (useAuthToken && token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${normalizeEndpoint(endpoint)}`, {
    ...restOptions,
    body,
    headers: finalHeaders,
  })

  const json = (await parseJsonSafe(response)) as ApiResponse<T>

  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`)
  }

  return json.data as T
}

export const loginUser = async (payload: LoginPayload): Promise<AuthPayload> => {
  return apiRequest<AuthPayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    useAuthToken: false,
  })
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthPayload> => {
  return apiRequest<AuthPayload>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    useAuthToken: false,
  })
}

export const getCurrentUser = async (token: string): Promise<User | null> => {
  try {
    const user = await apiRequest<User>('/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      useAuthToken: false,
    })

    return user || null
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

export const getUsers = async (): Promise<User[]> => {
  return apiRequest<User[]>('/users', {
    method: 'GET',
  })
}
