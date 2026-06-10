import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/better-auth";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import userRouter from "./routes/user";
import jobApplicationsRouter from "./routes/job-applications";
import foldersRouter from "./routes/folders";
import todoRouter from "./routes/todo";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:49600",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/jobapplications", jobApplicationsRouter);
app.use("/api/folder", foldersRouter);
app.use("/api/todoitems", todoRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
