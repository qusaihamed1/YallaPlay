import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "yallaplay_auth_token";
const AUTH_USER_KEY = "yallaplay_user_id";

export async function saveSecureAuthSession(token: string, userId: string) {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  await SecureStore.setItemAsync(AUTH_USER_KEY, userId);
}

export async function getSecureAuthSession() {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  const userId = await SecureStore.getItemAsync(AUTH_USER_KEY);
  return { token, userId };
}

export async function clearSecureAuthSession() {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(AUTH_USER_KEY);
}
