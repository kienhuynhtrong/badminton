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

export type GroupRole = 'admin' | 'member'
export type GroupEventStatus = 'voting' | 'locked' | 'completed'

export interface GroupWorkspaceMember {
  userId: string
  nickname: string
  username: string
  email: string
  role: GroupRole
  joinedAt?: string
}

export interface WorkspaceGroup {
  _id: string
  name: string
  description: string
  avatar: string
  creator_id: string
  maxMembers: number
  memberCount: number
  myRole: GroupRole
  members: GroupWorkspaceMember[]
}

export interface EventVoteSelection {
  scheduleOptionId: string
  locationOptionId: string
  courtOptionId: string
  note: string
  votedAt: string
}

export interface ScheduleVoteOption {
  _id: string
  label: string
  startAt?: string | null
  endAt?: string | null
  voteCount: number
  isMyChoice: boolean
}

export interface LocationVoteOption {
  _id: string
  label: string
  address: string
  voteCount: number
  isMyChoice: boolean
}

export interface CourtVoteOption {
  _id: string
  label: string
  courtCount: number
  voteCount: number
  isMyChoice: boolean
}

export interface EventFinalSelection {
  scheduleOptionId: string
  locationOptionId: string
  courtOptionId: string
  scheduleLabel: string
  locationLabel: string
  locationAddress: string
  courtLabel: string
  courtCount: number
  lockedAt?: string | null
  lockedBy: string
}

export interface PaymentItem {
  userId: string
  nickname: string
  username: string
  email: string
  amount: number
  isPaid: boolean
  paidAt?: string | null
}

export interface EventPaymentSummary {
  totalCost: number
  note: string
  paidCount: number
  pendingCount: number
  items: PaymentItem[]
}

export interface GroupEvent {
  _id: string
  title: string
  description: string
  status: GroupEventStatus
  createdAt: string
  updatedAt: string
  memberCount: number
  totalVotes: number
  myVote: EventVoteSelection | null
  scheduleOptions: ScheduleVoteOption[]
  locationOptions: LocationVoteOption[]
  courtOptions: CourtVoteOption[]
  finalSelection: EventFinalSelection | null
  payment: EventPaymentSummary
  permissions: {
    canManage: boolean
  }
}

export interface GroupWorkspace {
  group: WorkspaceGroup
  activeEvent: GroupEvent | null
}

export interface VoteOptionInput {
  label: string
  startAt?: string | null
  endAt?: string | null
  address?: string
  courtCount?: number
}

export interface CreateGroupEventPayload {
  title: string
  description?: string
  scheduleOptions: VoteOptionInput[]
  locationOptions: VoteOptionInput[]
  courtOptions: VoteOptionInput[]
  totalCost?: number
  paymentNote?: string
}

export interface SubmitVotePayload {
  scheduleOptionId: string
  locationOptionId: string
  courtOptionId: string
  note?: string
}

export interface UpdatePaymentPayload {
  totalCost: number
  note?: string
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

export const getGroupWorkspace = async (groupId: string): Promise<GroupWorkspace> => {
  return apiRequest<GroupWorkspace>(`/groups/${groupId}/workspace`, {
    method: 'GET',
  })
}

export const createGroupEvent = async (
  groupId: string,
  payload: CreateGroupEventPayload
): Promise<GroupWorkspace> => {
  return apiRequest<GroupWorkspace>(`/groups/${groupId}/events`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const submitGroupEventVote = async (
  groupId: string,
  eventId: string,
  payload: SubmitVotePayload
): Promise<GroupWorkspace> => {
  return apiRequest<GroupWorkspace>(`/groups/${groupId}/events/${eventId}/vote`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const lockGroupEvent = async (
  groupId: string,
  eventId: string
): Promise<GroupWorkspace> => {
  return apiRequest<GroupWorkspace>(`/groups/${groupId}/events/${eventId}/lock`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export const updateGroupEventPayment = async (
  groupId: string,
  eventId: string,
  payload: UpdatePaymentPayload
): Promise<GroupWorkspace> => {
  return apiRequest<GroupWorkspace>(`/groups/${groupId}/events/${eventId}/payment`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export const toggleGroupEventPayment = async (
  groupId: string,
  eventId: string,
  userId: string,
  isPaid?: boolean
): Promise<GroupWorkspace> => {
  return apiRequest<GroupWorkspace>(`/groups/${groupId}/events/${eventId}/payment/${userId}/toggle`, {
    method: 'POST',
    body: JSON.stringify(typeof isPaid === 'boolean' ? { isPaid } : {}),
  })
}

export const completeGroupEvent = async (
  groupId: string,
  eventId: string
): Promise<GroupWorkspace> => {
  return apiRequest<GroupWorkspace>(`/groups/${groupId}/events/${eventId}/complete`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}
