const express = require('express');
const { createUser, valideAccount, readUser } = require('../Controllers/User');

const router = express.Router();

router.route('/register').post(createUser);
router.route('/valide/:userToken').patch(valideAccount);
router.route('/login').post(readUser);
// router.route('/forgotpassword').___(___);

module.exports = router;
