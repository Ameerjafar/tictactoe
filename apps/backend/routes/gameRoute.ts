import express from "express";
import type { Request, Response } from "express";
import { prisma } from "@repo/db";
import { authMiddleware } from "../middleware/authMiddleware";
export const gameRoute = express.Router();


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

gameRoute.get(
  "/userstats",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    console.log("userId", userId)
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

gameRoute.get(
  "/usergames",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      const games = await prisma.game.findMany({
        where: {
          userId: userId as string,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20, // Limit to last 20 games
      });
      return res.status(200).json({ games });
    } catch (error: unknown) {
      console.error("Error fetching user games:", error);
      return res.status(500).json({ error });
    }
  }
);

gameRoute.post(
  "/creategame",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { roomId, isWin, isDraw } = req.body;
    try {
      if (!roomId || !userId) {
        return res
          .status(400)
          .json({ message: "you was not passed all the required data" });
      }
      const isUserExist = await prisma.user.findUnique({
        where: {
          id: userId as string,
        },
      });
      if (!isUserExist) {
        return res
          .status(404)
          .json({ message: "cannot find the user in the db" });
      }

      // Use a transaction to ensure both game creation and user stats update happen or fail together
      const [createGame, updateUser] = await prisma.$transaction([
        prisma.game.create({
          data: {
            userId,
            isWin: !!isWin, // Ensure boolean
            roomId,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            totalGames: { increment: 1 },
            wins: isWin ? { increment: 1 } : undefined,
            losses: !isWin && !isDraw ? { increment: 1 } : undefined,
            draws: isDraw ? { increment: 1 } : undefined,
          },
        }),
      ]);

      console.log("createGame", createGame);
      return res.status(201).json({ gameCreated: createGame, userStats: updateUser });
    } catch (error: unknown) {
      console.error("Error creating game:", error);
      return res.status(500).json({ error });
    }
  }
);
gameRoute.post(
  "/updatestats",
  authMiddleware,
  async (req: Request, res: Response) => {
    //   const { userId } = req.query as { userId: string };
    const userId = req.userId;
    const { win, lose, draw } = req.body as {
      win?: number;
      lose?: number;
      draw?: number;
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
