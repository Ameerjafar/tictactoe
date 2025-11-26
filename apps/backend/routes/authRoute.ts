import express from "express";
import {
  signinController,
  signupController,
} from "../controller/authController";
export const authRoute = express.Router();

authRoute.post("/signup", signupController);

authRoute.post("/signin", signinController);
