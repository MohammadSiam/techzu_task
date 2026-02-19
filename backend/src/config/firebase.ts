import admin from "firebase-admin";
import { env } from "./env";

let firebaseInitialized = false;

export function initFirebase() {
  if (firebaseInitialized || !env.FIREBASE_PROJECT_ID) {
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
  });

  firebaseInitialized = true;
}

export { admin };
