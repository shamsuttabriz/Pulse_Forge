import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

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
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDb,
};
