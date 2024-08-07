import express from "express";
import {
  signin,
  signout,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup); // signup route
router.post("/signin", signin); // signin route
router.post("/signout", signout); // signout route
router.post("/verify-email", verifyEmail); // verify email route

export default router;
