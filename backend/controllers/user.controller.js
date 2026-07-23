import { insertUser, findUserByEmail, getAllUsers, deleteUser, updateUser, findUserById, getUserImage, updateUserProfile, updateUserImage, getUserCoverImage, updateUserCoverImage, getUserDetail, getUserOrders, getUserOrderItems, getUserAddresses, getUserCartItems } from "../models/user.model.js";
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

    // Remove sensitive fields before sending response
    delete user.password;
    delete user.profileImageType;

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

// fetch single user detail (profile + orders + addresses + cart)
export const fetchUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserDetail(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const [orders, addresses, cart] = await Promise.all([
      getUserOrders(user.id),
      getUserAddresses(user.id),
      getUserCartItems(user.id),
    ]);
    let orderItems = [];
    if (orders.length > 0) {
      orderItems = await getUserOrderItems(orders.map((o) => o.id));
    }
    res.json({
      success: true,
      data: { user, orders, orderItems, addresses, cart },
    });
  } catch (error) {
    console.error("fetchUserDetail error:", error);
    res.status(500).json({ success: false, message: error.message });
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

// get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// serve user profile image as blob
export const getUserProfileImage = async (req, res) => {
  try {
    const image = await getUserImage(req.params.id);
    if (!image || !image.profileImage) {
      return res.status(404).json({ success: false, message: "No image" });
    }
    res.set("Content-Type", image.profileImageType || "image/jpeg");
    res.send(image.profileImage);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update user profile (name, email)
export const updateUserProfileController = async (req, res) => {
  try {
    const { name, email } = req.body;
    await updateUserProfile(req.user.userId, name, email);
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update user profile image (multer memoryStorage)
export const updateUserProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    await updateUserImage(req.user.userId, req.file.buffer, req.file.mimetype);
    res.json({ success: true, message: "Profile image updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// serve user cover photo as blob
export const getUserCoverImageCtrl = async (req, res) => {
  try {
    const image = await getUserCoverImage(req.params.id);
    if (!image || !image.coverPhoto) {
      return res.status(404).json({ success: false, message: "No cover photo" });
    }
    res.set("Content-Type", image.coverPhotoType || "image/jpeg");
    res.send(image.coverPhoto);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update user cover photo (multer memoryStorage)
export const updateUserCoverImageCtrl = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    await updateUserCoverImage(req.user.userId, req.file.buffer, req.file.mimetype);
    res.json({ success: true, message: "Cover photo updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};