const multer = require('multer');

const storage = multer.memoryStorage();

function filtroImagen(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Solo se permiten archivos de imagen'));
  }
  cb(null, true);
}

const uploadEvidencias = multer({
  storage,
  fileFilter: filtroImagen,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 6, 
  },
});

module.exports = uploadEvidencias;
