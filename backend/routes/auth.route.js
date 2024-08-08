import express from "express";
import {
  signin,
  signout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup); // signup route
router.post("/signin", signin); // signin route
router.post("/signout", signout); // signout route
router.post("/verify-email", verifyEmail); // verify email route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
