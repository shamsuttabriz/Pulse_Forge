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
    const result = await issueService.updateIssueInDb(id as string, req.body);
    
    // Fetch the full issue with reporter details
    const issueResult = await issueService.getIssueByIdFromDb(id as string);
    
    res.status(200).json({
      success: true,
      message: "Issue updated successfully!",
      data: issueResult.rows[0],
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
