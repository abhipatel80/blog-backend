import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter,
});

const mystorage = multer.memoryStorage();

export const userImgupload = multer({
  storage: mystorage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter,
});

export default upload;
