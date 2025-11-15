import "express";

declare module "express" {
  interface Request {
    user?: {
      usuarioID: number;
      email: string;
    };
  }
}
