import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import api from '../lib/api';
import { getStoredUser, setStoredUser, setTokens, clearTokens } from '../lib/storage';
import { User, AuthResponse } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await getStoredUser<User>();
        if (stored) {
          setUser(stored);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/login', { email, password });
    const { user: authUser, accessToken, refreshToken } = data.data;
    await setTokens(accessToken, refreshToken);
    await setStoredUser(authUser);
    setUser(authUser);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/signup', {
      username,
      email,
      password,
    });
    const { user: authUser, accessToken, refreshToken } = data.data;
    await setTokens(accessToken, refreshToken);
    await setStoredUser(authUser);
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // proceed with local logout even if server call fails
    } finally {
      await clearTokens();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get<{ data: User }>(`/user/${user?.username}`);
      await setStoredUser(data.data);
      setUser(data.data);
    } catch {
      // ignore
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
