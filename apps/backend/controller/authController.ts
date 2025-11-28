import type { Request, Response } from "express";
import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

const signinSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const signupController = async (req: Request, res: Response) => {
  try {
    const parsedBody = signupSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res
        .status(400)
        .json({ message: "Invalid inputs", errors: parsedBody.error });
      return;
    }

    const { name, email, password } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signinController = async (req: Request, res: Response) => {
  try {
    const parsedBody = signinSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res
        .status(400)
        .json({ message: "Invalid inputs", errors: parsedBody.error });
      return;
    }

    const { email, password } = parsedBody.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
