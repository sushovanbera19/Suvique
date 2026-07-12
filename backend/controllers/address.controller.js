import {
    getAddresses,
    addAddress
} from "../models/address.model.js";

// Get Address
export const fetchAddresses = (req, res) => {
    getAddresses(req.user.userId, (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        res.json({
            success: true,
            data: rows,
        });
    });
};

// Add Address
export const createAddress = (req, res) => {
    const userId = req.user.userId;

    const {
        first_name,
        last_name,
        email,
        phone,
        country,
        city,
        street,
        zip_code,
        additional_info,
    } = req.body;

    addAddress(
        [
            userId,
            first_name,
            last_name,
            email,
            phone,
            country,
            city,
            street,
            zip_code,
            additional_info,
        ],

        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            res.json({
                success: true,
                addressId: result.insertId,
            });

        }
    );
};