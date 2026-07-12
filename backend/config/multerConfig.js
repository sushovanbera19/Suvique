import multer from "multer";
import path from "path";
import fs from "fs";

// make sure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const cleanName = file.originalname
      .replace(/\s+/g, "_")       // remove spaces
      .replace(/[^a-zA-Z0-9._-]/g, ""); // remove special chars

    cb(null, Date.now() + "-" + cleanName);
  },
});

// file filter (only images allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});