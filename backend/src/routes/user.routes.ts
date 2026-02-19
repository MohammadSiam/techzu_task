import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateFcmToken } from "../controllers/interaction.controller";
import { updateFcmTokenSchema } from "../validators/post.validators";

const router = Router();

router.use(authenticate);

router.put("/me/fcm-token", validate(updateFcmTokenSchema), updateFcmToken);

export default router;
