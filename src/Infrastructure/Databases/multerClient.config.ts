import multer from "multer";
import fs from "fs";
import path from "path";

const imagesDir = path.join(__dirname, "images");

// Ensure the 'images' directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true }); // Create the directory if it doesn't exist
}


/**
 * Multer disk storage configuration instance.
 */
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(imagesDir, "");

    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save the file with its original name
  },
});

export const upload = multer({ storage });
