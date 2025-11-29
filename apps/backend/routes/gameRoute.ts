import express from "express";
import type { Request, Response } from "express";
import { prisma } from "@repo/db";
import { authMiddleware } from "../middleware/authMiddleware";
export const gameRoute = express.Router();
gameRoute.get(
  "userstats",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
      if (!userId) {
        return res.status(400).json({ message: "you did not mention the Id" });
      }
      const existingUser = await prisma.user.findUnique({
        where: {
          id: userId as string,
        },
      });
      if (!existingUser) {
        return res.status(404).json({ message: "user is not found in db" });
      }
      return res.status(200).json({ user: existingUser });
    } catch (error: unknown) {
      return res.status(500).json({ error });
    }
  }
);

gameRoute.get("/gamehistory", async (req: Request, res: Response) => {
  const { gameId } = req.query;
  try {
    if (!gameId) {
      return res.status(400).json({ message: "you cannnot pass the game Id" });
    }
    const isGameExist = await prisma.game.findUnique({
      where: {
        id: gameId as string,
      },
    });
    if (!isGameExist) {
      return res
        .status(404)
        .json({ message: "we cannot find the game in the db" });
    }
    return res.status(200).json({ game: isGameExist });
  } catch (error: unknown) {
    return res.status(500).json({ error });
  }
});

gameRoute.post(
  "/creategame",
  authMiddleware,
  async (req: Request, res: Response) => {
    //   const { userId } = req.query;
    const { roomId, player1, player2, roomWinner, totalRounds, userId } =
      req.body;
    try {
      if (!roomId || !player1 || !player2) {
        return res
          .status(400)
          .json({ message: "you was not passed all the required data" });
      }
      const isUserExist = await prisma.user.findUnique({
        where: {
          id: userId as string,
        },
      });
      if (isUserExist) {
        return res
          .status(404)
          .json({ message: "cannot find the user in the db" });
      }
      const createGame = await prisma.game.create({
        data: {
          userId: userId as string,
          roomId,
          player1,
          player2,
          roomWinner,
          totalRounds,
        },
      });
      console.log("createGame", createGame);
      return res.status(201).json({ gameCreated: createGame });
    } catch (error: unknown) {
      return res.status(500).json({ error });
    }
  }
);
gameRoute.post(
  "/updatestats",
  authMiddleware,
  async (req: Request, res: Response) => {
    //   const { userId } = req.query as { userId: string };
    const { userId, win, lose, draw } = req.body as {
      win?: number;
      lose?: number;
      draw?: number;
      userId: string;
    };

    try {
      if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
      }
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
          totalGames: {
            increment: (win ? 1 : 0) + (lose ? 1 : 0) + (draw ? 1 : 0),
          },
          wins: win ? { increment: win } : undefined,
          losses: lose ? { increment: lose } : undefined,
          draws: draw ? { increment: draw } : undefined,
        },
      });

      return res.status(200).json({
        message: "Stats updated successfully",
        user: {
          id: updateUser.id,
          totalGames: updateUser.totalGames,
          wins: updateUser.wins,
          losses: updateUser.losses,
          draws: updateUser.draws,
        },
      });
    } catch (error: unknown) {
      console.error("Update stats error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
