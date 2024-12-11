import { Request } from "express";
import { verifyToken } from "../utils/auth";

export const getUser = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  try {
    const token = authHeader.split("Bearer ")[1];
    if (!token) return null;

    return verifyToken(token);
  } catch (error) {
    return null;
  }
};
