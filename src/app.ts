import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import voteRoutes from "./routes/vote.routes";
import electionRoutes from "./routes/election.routes";

dotenv.config();

export function createApp(): Application {
  const app: Application = express();

  // 2. Middleware Setup
  app.use(cors());
  app.use(express.json());
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // 3. Health Check Route
  app.get("/", (req: Request, res: Response) => {
    res.send({
      status: "OK",
      message: "Election System API is running",
    });
  });

  // 4. API Routes
  app.use("/api/votes", voteRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/election", electionRoutes);

  // 5. Global Error Handling Middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  return app;
}
