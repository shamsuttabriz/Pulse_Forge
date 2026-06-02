import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { IUser } from "../users/user.interface";

const createUserIntoDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
    RETURNING *
  `,
    [name, email, hashPassword, role],
  );

  delete result.rows[0].password;

  return result;
};

const loginUserIntoDb = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  // Todo: If the user exists -> Done
  const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = userData.rows[0];
  if (!user) {
    throw new Error("User not found!");
  }

  // Todo: Compare the password -> Done
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password!");
  }
  delete user.password;

  // Todo: Generate a JWT token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1d",
  });

  return { accessToken, user: jwtPayload };
};

export const authService = {
  createUserIntoDb,
  loginUserIntoDb,
};
