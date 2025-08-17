import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";





dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activity", activityRoutes);



// Connect to MongoDB
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
