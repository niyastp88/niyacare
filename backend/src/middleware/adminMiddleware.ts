import { Response, NextFunction } from "express";

import { AuthRequest } from "./authMiddleware";

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      message: "Admin access required",
    });
    return;
  }

  next();
};
