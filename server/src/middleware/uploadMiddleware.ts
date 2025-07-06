// src/middleware/uploadMiddleware.ts
import multer from "multer";
import path from "path";

// Définir le stockage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Vérifier le type de fichier
const fileFilter = (req: any, file: any, cb: any) => {
  const fileTypes = /jpg|jpeg|png|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
