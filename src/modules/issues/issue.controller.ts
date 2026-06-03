import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";
import { pool } from "../../db";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDb(req.body);
    const issue = result.rows[0];
    
    // Fetch reporter details
    const reporterResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = $1`,
      [req.body.reporter_id]
    );
    
    const issueWithReporter = {
      ...issue,
      reporter: reporterResult.rows[0],
    };
    
    res.status(201).json({
      success: true,
      message: "Issue created successfully!",
      data: issueWithReporter,
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
    
    // Check authorization: get the issue first
    const issueResult = await issueService.getIssueByIdFromDb(id as string);
    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }
    
    const issue = issueResult.rows[0];
    const user = req.user as any;
    
    // Get current user's ID from database
    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [user.email]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    
    const userId = userResult.rows[0].id;
    
    // Authorization check: maintainer can update any issue, contributor can only update their own
    if (user.role === "contributor" && issue.reporter.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own issues!",
      });
    }
    
    // Update the issue
    const result = await issueService.updateIssueInDb(id as string, req.body);
    
    // Fetch the full issue with reporter details
    const updatedIssueResult = await issueService.getIssueByIdFromDb(id as string);
    
    res.status(200).json({
      success: true,
      message: "Issue updated successfully!",
      data: updatedIssueResult.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
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
