import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Invalid/Expired token");
  }
};
