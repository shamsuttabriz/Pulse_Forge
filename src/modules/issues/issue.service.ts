import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDb = async (payload: IIssue) => {
  const { title, description, type, status, reporter_id } = payload;

  const reporter = await pool.query(
    `
        SELECT * FROM users WHERE id = $1
    `,
    [reporter_id],
  );

  if (reporter.rows.length === 0) {
    throw new Error("Reporter not found!");
  }

  const result = await pool.query(
    `
        INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,
    [title, description, type, status || "open", reporter_id],
  );

  return result;
};

const getAllIssuesFromDb = async () => {
  const result = await pool.query("SELECT * FROM issues");
  return result;
};

const getIssueByIdFromDb = async (id: string) => {
  const result = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);
  return result;
};

const updateIssueInDb = async (id: string, payload: Partial<IIssue>) => {
  const { title, description, type, status } = payload;
  const result = await pool.query(
    `
     UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), status = COALESCE($4, status)
     WHERE id = $5 RETURNING *
   `,
    [title, description, type, status, id],
  );
  return result;
};

const deleteIssueFromDb = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id],
  );
  return result;
};

export const issueService = {
  createIssueIntoDb,
  getAllIssuesFromDb,
  getIssueByIdFromDb,
  updateIssueInDb,
  deleteIssueFromDb,
};
