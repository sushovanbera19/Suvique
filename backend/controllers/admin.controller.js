import { findAdminByEmail } from "../models/admin.model.js";

export const adminLogin = (req, res) => {

    const { email, password } = req.body;

    // check email
    findAdminByEmail(email, (err, result) => {

        // db error
        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        // admin not found
        if (result.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        const admin = result[0];

        // password check
        if (admin.password !== password) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        // success
        return res.status(200).json({
            success: true,
            message: "Admin Login Successful",
            admin: {
                name: admin.name,
                email: admin.email,
            },
        });
    });
};