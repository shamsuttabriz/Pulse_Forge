import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const getAllUsersFromDb = async () => {
  const result = await pool.query("SELECT * FROM users");
  result.rows.forEach((user) => delete user.password);
  return result;
};

const getUserByIdFromDb = async (id: string) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  
  delete result.rows[0].password;
  return result;
};

const updateUserInDb = async (id: string, payload: Partial<IUser>) => {
  const { name, password, role } = payload;
  const hashPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const result = await pool.query(
    `
        UPDATE users SET name = COALESCE($1, name), password = COALESCE($2, password), role = COALESCE($3, role)
        WHERE id = $4 RETURNING *
      `,
    [name, hashPassword, role, id],
  );
  
  delete result.rows[0].password;
  return result;
};

const deleteUserFromDb = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id],
  );
  delete result.rows[0].password;
  return result;
};

export const userService = {
  getAllUsersFromDb,
  getUserByIdFromDb,
  updateUserInDb,
  deleteUserFromDb,
};
