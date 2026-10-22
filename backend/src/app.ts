import "dotenv/config";
import cors from "cors";
import express from "express";

import pool from "./config/db.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import loanRouter from "./routes/loan.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", userRouter);
app.use("/loans", loanRouter);

app.use(errorHandler);

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected");

    app.listen(port, () => {
      console.log(`miniledger backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

startServer();
