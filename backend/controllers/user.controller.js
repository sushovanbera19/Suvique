import { insertUser, findUserByEmail, getAllUsers, deleteUser, updateUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, agreeTerms } = req.body;

    // Check if email already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const agreeTermsValue =
      agreeTerms === true ||
        agreeTerms === 1 ||
        agreeTerms === "true" ||
        agreeTerms === "on"
        ? 1
        : 0;

    // Generate user ID
    const userId = `USR${Date.now()}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await insertUser(
      userId,
      name,
      email,
      hashedPassword,
      agreeTermsValue
    );
    const token = jwt.sign(
      {
        userId: user.id,   // 🔥 THIS IS THE FIX (numeric ID)
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        userId,
        name,
        email,
      },
    });

  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Error saving user",
    });
  }
};

// login controller

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    // Remove password before sending response
    delete user.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// fetch usercontroller
export const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users); // send all users
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update single user
export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    await updateUser(userId, name, email);

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

// delete single user
export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    await deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};