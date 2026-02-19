import { Stack } from "expo-router";
import { useNotifications } from "../../src/hooks/useNotifications";

export default function AppLayout() {
  useNotifications();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="post/[id]"
        options={{
          headerTitle: "Post",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
