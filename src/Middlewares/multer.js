const multer = require('multer');
let path = require('path');
const uploadDirectory = path.join(__dirname, '../uploads');

let newFileName;

let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      const imageName = file.originalname.split('.');
      newFileName = `${imageName[0]}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      cb(null, newFileName);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      'Error: File upload only supports the following filetypes - ' + filetypes
    );
  },
});

module.exports = { upload };
