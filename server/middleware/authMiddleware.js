import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect middleware - verifies JWT token
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin only middleware (approved admins)
export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin" || user.status !== "approved") {
      return res.status(403).json({ message: "Admin only access" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
