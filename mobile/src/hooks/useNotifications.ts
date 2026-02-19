import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useUpdateFcmTokenMutation } from "../features/apiSlice";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [updateFcmToken] = useUpdateFcmTokenMutation();

  useEffect(() => {
    async function registerForPushNotifications() {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          return;
        }

        const tokenData = await Notifications.getDevicePushTokenAsync();
        await updateFcmToken({ fcmToken: tokenData.data });
      } catch (error) {
        console.log("Failed to get push token:", error);
      }
    }

    if (Platform.OS !== "web") {
      registerForPushNotifications();
    }
  }, [updateFcmToken]);
}
