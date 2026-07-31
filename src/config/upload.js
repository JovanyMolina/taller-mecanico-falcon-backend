const multer = require('multer');
const path = require('path');
const fs = require('fs');

const CARPETA_LOGOS = path.join(__dirname, '../../uploads/logos');


fs.mkdirSync(CARPETA_LOGOS, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CARPETA_LOGOS),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${extension}`);
  },
});

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

function filtroArchivo(req, file, cb) {
  if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
  cb(null, true);
}

const uploadLogo = multer({
  storage,
  fileFilter: filtroArchivo,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

module.exports = { uploadLogo, CARPETA_LOGOS };
