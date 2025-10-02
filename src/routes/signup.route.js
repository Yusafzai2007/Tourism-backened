import { Router } from "express";
import {
  signupuser,
  loginUser,
  logoutUser,
  getusers,
} from "../controllers/signup.controller.js";
import { jwtVerify } from "../middlewares/authi.middleware.js";
const router = Router();

router.post("/signup", signupuser);
router.post("/login", loginUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/getusers").get(getusers);
export default router;
