import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { ERROR } from "./src/constant.js";
import { connectDB } from "./src/config/dbConfig.js";
import userRouter from "./src/routers/userRouter.js";
import bookRouter from "./src/routers/bookRouter.js";
import { isAuth } from "./src/middlewares/authMiddleware.js";
import transactionRouter from "./src/routers/transactionRouter.js";

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// Connect to the database
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// API routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", isAuth, bookRouter);
app.use("/api/v1/transaction", isAuth, transactionRouter);

// Serve static files from the "client/build" directory
app.use(express.static(path.join(__dirname, "/client/build")));

// Route to serve your static client build
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// Global error handler
app.use((error, req, res, next) => {
  console.log(error.message);

  const errorCode = error.errorCode || 500;
  res.status(errorCode).json({
    status: ERROR,
    message: error.message,
  });
});

// Run the server
app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});

export default app;
