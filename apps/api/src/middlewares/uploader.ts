import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (req.baseUrl.includes('/profile')) {
      uploadPath = path.join(__dirname, '../../public/uploads/profile');
    } else if (req.baseUrl.includes('/users')) {
      uploadPath = path.join(__dirname, '../../public/uploads/profile');
    } else if (req.baseUrl.includes('/products')) {
      uploadPath = path.join(__dirname, '../../public/uploads/products');
    } else {
      uploadPath = path.join(__dirname, '../../public/uploads/others');
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB
  },
});
