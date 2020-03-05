import { Request, Response, NextFunction } from "express";

export default function test(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log("object");
  next();
}
