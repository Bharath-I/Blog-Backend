import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/userRoute.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoute.js";
import commentRoutes from "./routes/commentRoutes.js";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("connected to db"))
  .catch(() => console.log("failed to connect db"));

app.listen(3000, () => {
  console.log("server running on port 3000");
});

app.use("/api/user", router);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname, "/frontend-react/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend-react", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});