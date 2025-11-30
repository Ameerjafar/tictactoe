import express from "express";
import { authRoute } from "./authRoute";
import { FileSystemRouter } from "bun";
import { gameRoute } from "./gameRoute";
// import { multiplayerRoute } from "./multiplayerRoute";
export const routes = express.Router();

routes.use("/auth", authRoute);
routes.use('/game', gameRoute)
// routes.use("/multiplayer", multiplayerRoute);
