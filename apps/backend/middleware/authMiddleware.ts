import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { useReducer } from "react";
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const findUser = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!findUser) {
      return res.status(404).json({ message: "user is not found in the db" });
    }
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};
