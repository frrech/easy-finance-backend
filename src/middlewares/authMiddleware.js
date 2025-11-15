// authMiddleware.js
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token ausente" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ JWT verification failed:", err);
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }

    console.log("🔍 Decoded token:", decoded);

    req.user = {
      usuarioID: Number(decoded.usuarioID),
      email: decoded.email,
    };

    console.log("🧾 req.user:", req.user);

    next();
  });
}
