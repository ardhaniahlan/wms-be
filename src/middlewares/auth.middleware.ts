import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "GET") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Akses ditolak. Token tidak ditemukan.",
      });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Token tidak valid atau sudah kedaluwarsa.",
      });
  }
};
