import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/users/user.route";
import { issueRouter } from "./modules/issues/issue.route";
import { authRouter } from "./modules/auth/auth.route";
import fs from "fs";
import logger from "./middleware/logger";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

app.use("/api/users", userRouter);
app.use("/api/issues", issueRouter);
app.use("/api/auth", authRouter);

export default app;
