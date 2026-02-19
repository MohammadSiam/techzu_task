import { Router } from "express";
import { signup, login, refresh } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiter";
import {
  signupSchema,
  loginSchema,
  refreshSchema,
} from "../validators/auth.validators";

const router = Router();

router.use(authLimiter);

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);

export default router;
