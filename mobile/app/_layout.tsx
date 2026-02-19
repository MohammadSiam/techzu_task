import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { Provider, useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, View } from "react-native";
import { store, RootState, AppDispatch } from "../src/store";
import { setCredentials, setLoading } from "../src/features/authSlice";
import {
  getAccessToken,
  getRefreshToken,
} from "../src/lib/secureStorage";

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
        // We don't have the user info in secure store, so we'll need to
        // rely on a minimal auth state. The user info will be refreshed
        // on the next API call.
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
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
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
