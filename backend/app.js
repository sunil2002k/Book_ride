import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/db.js";
connectDB();
import userRoutes from "./routes/user_routes.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/users", userRoutes);

export default app;
