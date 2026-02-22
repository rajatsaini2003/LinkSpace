import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: 'linkspace_access_token',
  REFRESH_TOKEN: 'linkspace_refresh_token',
  USER: 'linkspace_user',
} as const;

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.ACCESS_TOKEN, accessToken],
    [KEYS.REFRESH_TOKEN, refreshToken],
  ]);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN, KEYS.USER]);
}

export async function getStoredUser<T>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setStoredUser<T>(user: T): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}
