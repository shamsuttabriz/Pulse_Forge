import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDb = async (payload: IIssue, user: any) => {
  const { title, description, type, status } = payload;

  const reporter = await pool.query(
    `
    SELECT * FROM users
    WHERE id = $1
    `,
    [user.id],
  );

  if (reporter.rows.length === 0) {
    throw new Error("Reporter not found!");
  }

  const result = await pool.query(
    `
    INSERT INTO issues
    (title, description, type, status, reporter_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [title, description, type, status || "open", user.id],
  );

  return result;
};

const getAllIssuesFromDb = async (queryParams?: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  let query = `
    SELECT i.id, i.title, i.description, i.type, i.status,
           json_build_object('id', u.id, 'name', u.name, 'role', u.role) as reporter,
           i.created_at, i.updated_at
    FROM issues i
    LEFT JOIN users u ON i.reporter_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramCount = 1;

  if (queryParams?.type) {
    query += ` AND i.type = $${paramCount}`;
    params.push(queryParams.type);
    paramCount++;
  }

  if (queryParams?.status) {
    query += ` AND i.status = $${paramCount}`;
    params.push(queryParams.status);
    paramCount++;
  }

  if (queryParams?.sort === "oldest") {
    query += ` ORDER BY i.created_at ASC`;
  } else {
    query += ` ORDER BY i.created_at DESC`;
  }

  const result = await pool.query(query, params);
  return result;
};

const getIssueByIdFromDb = async (id: string) => {
  const result = await pool.query(
    `
      SELECT i.id, i.title, i.description, i.type, i.status,
             json_build_object('id', u.id, 'name', u.name, 'role', u.role) as reporter,
             i.created_at, i.updated_at
      FROM issues i
      LEFT JOIN users u ON i.reporter_id = u.id
      WHERE i.id = $1
    `,
    [id],
  );
  return result;
};

const updateIssueInDb = async (id: string, payload: Partial<IIssue>) => {
  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      status = COALESCE($4, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING
      id,
      title,
      description,
      type,
      status,
      reporter_id,
      created_at,
      updated_at
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
