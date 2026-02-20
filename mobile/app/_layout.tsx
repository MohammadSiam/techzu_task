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
} from "../src/lib/secureStorage";
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
        dispatch(
          setCredentials({
            user: { id: "", username: "", email: "", createdAt: "" },
            accessToken,
            refreshToken,
          })
        );
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
