import type { NextFunction, Request, Response } from "express";
import fstat from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
//   console.log("Method - URL - Time:", req.method, req.url, new Date());
  const log = `Method: ${req.method}, URL: ${req.url}, Time: ${new Date()}\n`;

  fstat.appendFile("logger.txt", log, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
  next();
};

export default logger;
