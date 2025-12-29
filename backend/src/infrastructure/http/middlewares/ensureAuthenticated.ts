import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const [, token] = authHeader.split(" ");

  try {
    verify(token, process.env.JWT_SECRET!);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
