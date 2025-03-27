import { NextFunction, Request, Response } from "express";

export class AdminMiddleware {
  static validateAdmin(req: Request, res: Response, next: NextFunction) {
    const { role } = req.body.user;

    if (role === "Administrator") {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
}
