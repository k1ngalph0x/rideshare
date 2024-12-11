// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { User, IUser } from "../models/User";

// export interface AuthRequest extends Request {
//   user?: IUser | null;
// }

// export const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       req.user = null;
//       return next();
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: string;
//     };
//     const user = await User.findById(decoded.id).select("-password");
//     req.user = user;
//     next();
//   } catch (error) {
//     req.user = null;
//     next();
//   }
// };
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
