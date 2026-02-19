import { prisma } from "../lib/prisma";
import { admin } from "../config/firebase";

export class NotificationService {
  async sendToUser(userId: string, title: string, body: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fcmToken: true },
      });

      if (!user?.fcmToken) return;

      await admin.messaging().send({
        token: user.fcmToken,
        notification: { title, body },
      });
    } catch (error) {
      // Log but don't throw — notifications are best-effort
      console.error("Failed to send notification:", error);
    }
  }
}
