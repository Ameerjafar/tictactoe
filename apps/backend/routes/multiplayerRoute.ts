import express from "express";
import {
  createRoomController,
  joinRoomController,
  closeRoomController,
} from "../controller/roomController";

export const multiplayerRoute = express.Router();

multiplayerRoute.post("/createroom", createRoomController);

multiplayerRoute.post("/joinroom", joinRoomController);

multiplayerRoute.post("/closeroom", closeRoomController);
