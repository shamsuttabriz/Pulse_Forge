import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDb = async (payload: IUser) => {
  const { name, email, password, role = 'contributor' } = payload;
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
    [name, email, password, role],
  );

  return result;
};

const getAllUsersFromDb = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result;
};

const getUserByIdFromDb = async (id: string) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result;
}

const updateUserInDb = async (id: string, payload: Partial<IUser>) => {
    const { name, password, role } = payload;
    const result = await pool.query(
      `
        UPDATE users SET name = COALESCE($1, name), password = COALESCE($2, password), role = COALESCE($3, role)
        WHERE id = $4 RETURNING *
      `,
      [name, password, role, id],
    );
    return result;
}

export const userService = {
  createUserIntoDb,
  getAllUsersFromDb,
  getUserByIdFromDb,
  updateUserInDb,
};
