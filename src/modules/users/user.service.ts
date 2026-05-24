import { pool } from "../../db";

const createUserIntoDb = async (payload: any) => {
  const { name, email, password, role } = payload;
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

export const userService = {
  createUserIntoDb,
};
