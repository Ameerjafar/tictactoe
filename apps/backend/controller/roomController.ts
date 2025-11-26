import type { Request, Response } from "express";
import { client } from "../inmemory/redis";
export const createRoomController = async (req: Request, res: Response) => {
  const { userId, roomId } = req.body;
  try {
    if (!userId || !roomId) {
      return res.status(400).json({ message: "missing fields" });
    }
    const existingRoom = await client.get(roomId);
    if (existingRoom) {
      return res
        .status(400)
        .json({
          message: "The room is already exist please create another room",
        });
    }
    await client.set(roomId, JSON.stringify([userId]));
    return res.status(201).json({ message: "room created successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const joinRoomController = async (req: Request, res: Response) => {
  const { userId, roomId } = req.body;
  try {
    if (!userId || !roomId) {
      return res.status(400).json({ message: "missing fields" });
    }
    const findRoom = await client.get(roomId);
    if (!findRoom) {
      return res
        .status(400)
        .json({ message: "cannot find the roomId in the redis" });
    }
    const object: any = JSON.parse(findRoom);
    console.log(object);
    if (userId === object[0]) {
      return res.status(400).json({ message: "you cannot join this room" });
    }
    object.push(userId);
    await client.set(roomId, JSON.stringify(object));
    return res.status(200).json({ message: "joined the room successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const closeRoomController = async (req: Request, res: Response) => {
  const { userId, roomId } = req.body;
  try {
    if (!userId || !roomId) {
      return res.status(400).json({ message: "missing requirements" });
    }
    const getRoomMember = await client.get(roomId);
    if (!getRoomMember) {
      return res.status(400).json({ message: "the room does not exist" });
    }
    const members = JSON.parse(getRoomMember!);
    if (members[0] !== userId) {
      return res.status(405).json({ message: "The owner only close the room" });
    }

    const deleteRoom = await client.del(roomId);
    console.log("Deleted Room", deleteRoom);
    return res.status(200).json({ message: "room closed successfully" });
  } catch (error: unknown) {
    return res.status(500).json({ error });
  }
};
