import { insertUser,findUserByEmail } from "../models/user.model.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, password, agreeTerms } = req.body;

        const agreeTermsValue =
            agreeTerms === true ||
                agreeTerms === 1 ||
                agreeTerms === "true" ||
                agreeTerms === "on"
                ? 1
                : 0;

        await insertUser(name, email, password, agreeTermsValue);

        res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId,
        });

    } catch (error) {
        res.status(500).json({
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
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};