import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { Provider, useSelector, useDispatch } from "react-redux";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Unable to activate keep awake"]);
import { store, RootState, AppDispatch } from "../src/store";
import { setCredentials, setLoading } from "../src/features/authSlice";
import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "../src/lib/secureStorage";
import { BASE_URL } from "../src/constants/config";
import AppSplash from "../src/components/AppSplash";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const segments = useSegments();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function restoreTokens() {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken && refreshToken) {
        try {
          const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              dispatch(
                setCredentials({
                  user: json.data.user || { id: "", username: "", email: "", createdAt: "" },
                  accessToken: json.data.accessToken,
                  refreshToken: json.data.refreshToken,
                })
              );
              return;
            }
          }
          // Token invalid or backend returned error
          await clearTokens();
          dispatch(setLoading(false));
        } catch {
          // Backend unreachable — clear tokens, show login
          await clearTokens();
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
      }
    }
    restoreTokens();
  }, [dispatch]);

  useEffect(() => {
    if (!mounted || isLoading) return;

    const inAuth = segments[0] === "sign-in" || segments[0] === "sign-up";

    if (!isAuthenticated && !inAuth) {
      router.replace("/sign-in");
    } else if (isAuthenticated && inAuth) {
      router.replace("/(app)/(tabs)");
    }
  }, [mounted, isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return <AppSplash />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
