'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/api'
import type { CurrentUser, User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types'

interface AuthValue {
  user: CurrentUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (c: LoginCredentials) => Promise<void>
  register: (c: RegisterCredentials) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const me = await apiGet<CurrentUser>('/api/users/me')
      setUser(me)
    } catch {
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
  }, [])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token) {
      fetchMe().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [fetchMe])

  const login = async (creds: LoginCredentials) => {
    const res = await apiPost<AuthResponse>('/api/auth/login', creds)
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    setUser(res.user as CurrentUser)
    await fetchMe() // get full user with _count
  }

  const register = async (creds: RegisterCredentials) => {
    const res = await apiPost<AuthResponse>('/api/auth/register', creds)
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    setUser(res.user as CurrentUser)
    await fetchMe()
  }

  const logout = () => {
    const rt = localStorage.getItem('refreshToken')
    if (rt) apiPost('/api/auth/logout', { refreshToken: rt }).catch(() => {})
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
