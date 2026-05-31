import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";
import { pool } from "../../db";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDb(req.body);
    res.status(201).json({
      success: true,
      message: "Issue created successfully!",
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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDb();
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
    res.status(200).json({
      success: true,
      message: "Issue updated successfully!",
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
