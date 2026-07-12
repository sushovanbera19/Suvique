import { insertContact } from "../models/contact.model.js";

// store contact form data
export const createContact = (req, res) => {
  const { name, email, message } = req.body;

  // simple validation
  if (!name || !email || !message) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }

  // call model
  insertContact(name, email, message, (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: "Database error",
      });
    }

    return res.json({
      success: true,
      message: "Contact saved successfully",
    });
  });
};