import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
const __dirname = path.resolve();

import { ERROR } from "./src/constant.js";
const app = express();
const PORT = process.env.NODE_ENV || 8000;

//connect to database
import { connectDB } from "./src/config/dbConfig.js";
// connectDB();

//middlewares
app.use(express.json());
app.use(cors());

// api routers
import userRouter from "./src/routers/userRouter.js";
import bookRouter from "./src/routers/bookRouter.js";
import { isAuth } from "./src/middlewares/authMiddleware.js";
import transactionRouter from "./src/routers/transactionRouter.js";

app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", isAuth, bookRouter);
app.use("/api/v1/transaction", isAuth, transactionRouter);

app.use("/register", (req, res) => {
  res.send("OOOPS");
});
//serving
app.use("/", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
  } catch (error) {
    next(error);
  }
});

// all uncaught request
// app.use("*", (req, res) => {
//   // res.redirect("/");
//   res.json({
//     message: "System status is healthy!",
//   });
// });

//global error handler
app.use((error, req, res, next) => {
  console.log(error.message);

  const errorCode = error.errorCode || 500;
  res.status(errorCode).json({
    status: ERROR,
    message: error.message,
  });
});

//run the server
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at http://localhost:${PORT}`);
});
