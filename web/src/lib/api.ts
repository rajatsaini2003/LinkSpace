import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiEnvelope } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach access token ──
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// ── Refresh on 401 ──
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error)

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        if (original.headers) original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const refreshToken =
      typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null

    if (!refreshToken) {
      processQueue(error)
      isRefreshing = false
      clearTokens()
      return Promise.reject(error)
    }

    try {
      const { data: envelope } = await axios.post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>(
        `${API_URL}/api/auth/refresh`,
        { refreshToken },
      )
      const { accessToken, refreshToken: newRefresh } = envelope.data
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefresh)
      }
      processQueue(null, accessToken)
      if (original.headers) original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (refreshErr) {
      processQueue(refreshErr)
      clearTokens()
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  },
)

function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

// ── Typed helpers that unwrap the { success, data } envelope ──

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data: envelope } = await api.get<ApiEnvelope<T>>(url, { params })
  return envelope.data
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const { data: envelope } = await api.post<ApiEnvelope<T>>(url, body)
  return envelope.data
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const { data: envelope } = await api.put<ApiEnvelope<T>>(url, body)
  return envelope.data
}

export async function apiDelete<T = null>(url: string): Promise<T> {
  const { data: envelope } = await api.delete<ApiEnvelope<T>>(url)
  return envelope.data
}

export default api
