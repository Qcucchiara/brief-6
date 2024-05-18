const express = require('express');
const {
  createUser,
  valideAccount,
  login,
  resetPassword,
  changePassword,
} = require('../Controllers/User/User');
const { upload } = require('../Middlewares/multer');

const router = express.Router();

router.route('/register').post(upload.single('image'), createUser);
router.route('/valide/:userToken').get(valideAccount);
router.route('/login').post(login);
router.route('/forgotpassword').patch(resetPassword);
router.route('/changepassword/:token').patch(changePassword);

module.exports = router;
