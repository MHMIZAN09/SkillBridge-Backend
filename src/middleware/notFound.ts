import { Request, Response } from "express";
import path from "node:path";

export function notFound (req: Request, res: Response) {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.originalUrl,
    date: new Date().toISOString(),
  });
}
