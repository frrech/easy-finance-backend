import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

  const [scheme, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("🔎 TOKEN DECODED:", decoded);  // <--- ADD THIS

    (req as any).user = {
      id: (decoded as any).id,
    };

    next();
  } catch (e) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
}
