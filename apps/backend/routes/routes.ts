import express from "express";
import { authRoute } from "./authRoute";
import { multiplayerRoute } from "./multiplayerRoute";
export const routes = express.Router();

routes.use("/auth", authRoute);
routes.use("/multiplayer", multiplayerRoute);
