import { findAdminByEmail, createAdmin, } from "../models/admin.model.js";

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, agreeTerms, } = req.body;
    // check email
    const [existingAdmin] = await findAdminByEmail(email);

    if (existingAdmin.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // create admin
    await createAdmin(name, email, password, confirmPassword, agreeTerms ? 1 : 0);
    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// LOGIN (UNCHANGED - your working code)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [result] = await findAdminByEmail(email);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin = result[0];

    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      admin: {
        name: admin.name,
        email: admin.email,
        avatar: admin.avatar || null,
        cover_photo: admin.cover_photo || null,
        role: admin.role || "Administrator",
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};