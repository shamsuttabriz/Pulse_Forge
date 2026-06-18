import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { pool } from "../../db";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDb(
      req.body,
      req.user as any,
    );

    const issue = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;
    const result = await issueService.getAllIssuesFromDb({
      sort: sort as string,
      type: type as string,
      status: status as string,
    });
    res.status(200).json({
      success: true,
      message: "Issues retrieved successfully!",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getIssueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getIssueByIdFromDb(id as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const issueResult = await issueService.getIssueByIdFromDb(id as string);

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }

    const issue = issueResult.rows[0];
    const user = req.user as any;

    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [user.email],
    );

    const userId = userResult.rows[0].id;

    if (user.role === "contributor" && issue.reporter.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own issues!",
      });
    }

    // Automatically update status from "open" to "in_progress" if not explicitly provided
    const updatePayload = { ...req.body };
    if (issue.status === "open" && !updatePayload.status) {
      updatePayload.status = "in_progress";
    }

    const result = await issueService.updateIssueInDb(id as string, updatePayload);

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.deleteIssueFromDb(id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully!",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
