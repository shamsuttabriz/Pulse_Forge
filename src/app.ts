import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { initDB, pool } from "./db";
import { userRouter } from "./modules/users/user.route";
import { userController } from "./modules/users/user.controller";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

app.use("/api/users", userRouter);

export default app;
