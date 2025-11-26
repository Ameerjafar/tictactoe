import express from "express";
import { authRoute } from "./authRoute";
import { multiplayerRoute } from "./multiplayerRoute";
import { connectRedis } from '../inmemory/redis'
export const routes = express.Router();

routes.use("/auth", authRoute);
routes.use("/multiplayer", multiplayerRoute);
