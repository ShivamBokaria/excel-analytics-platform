import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Set status based on role
    const status = role === "admin" ? "pending" : "approved";

    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role,
      status 
    });

    if (role === "admin") {
      res.status(201).json({ 
        message: "Admin registration successful! Your account is pending approval.",
        requiresApproval: true
      });
    } else {
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password, role = "user" } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Check if user is trying to login as admin but account is pending
    if (role === "admin" && user.role === "admin" && user.status === "pending") {
      return res.status(403).json({ 
        message: "Your admin account is pending approval. Please contact an existing administrator." 
      });
    }

    // Check if user is trying to login as admin but is not an admin
    if (role === "admin" && user.role !== "admin") {
      return res.status(403).json({ 
        message: "You don't have admin privileges." 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        status: user.status 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user (protected)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
