import type { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret,
      ) as JwtPayload;

      // console.log("Decoded JWT Payload:", decoded);

      const userData = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [decoded.email],
      );

      // const user = userData.rows[0];
      // console.log("User data from DB:", user);

      if (userData.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      req.user = decoded;

      next();
    } catch (err: any) {
      next(err);
    }
  };
};

export default auth;
