const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool } = require('../Services/mysql');
// const { transporter } = require('../Services/mailer');

const createUser = async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role; // a changer
    const isActive = false;
    const gdpr = () => {
      if (req.body.gdpr === true) {
        return new Date();
      } else {
        return null;
      }
    };
    const createdAt = new Date();
    const updatedAt = new Date();

    if (!firstName || !lastName || !email || !password || !gdpr) {
      res.status(400).json({ error: 'Some fields are missing' });
      return;
    }

    const sql_verification = `SELECT * FROM user WHERE email = ? OR username = ?`;
    const values_verification = [email, username];
    const [verification] = await pool.execute(
      sql_verification,
      values_verification
    );

    if (verification.length !== 0) {
      res
        .status(400)
        .json({ error: 'invalid credentials (mail aldeady used)' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = await bcrypt.hash(email, 10);
    const cleanToken = activationToken.replaceAll('/', '');

    const sqlUser = `INSERT INTO user VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const valuesUser = [
      firstName,
      lastName,
      username,
      email,
      hashedPassword,
      role,
      isActive,
      cleanToken,
      gdpr(),
      createdAt,
      updatedAt,
    ];

    const [resultUser] = await pool.execute(sqlUser, valuesUser);

    if (resultUser.affectedRows !== 1) {
      res.status(400).json({ error: 'something went wrong' });
      return;
    }
    res.status(201).json({ result: resultUser });
    // const info = await transporter.sendMail({
    //   from: `${process.env.SMTP_EMAIL}`,
    //   to: email,
    //   subject: 'email activation ✔',
    //   text: 'activate your email',
    //   html: `<b>click here to <a href = "http://localhost:3000/api/guest/valide/user/${cleanToken}">activate your account</a></b>`,
    // });
    // console.log('Message sent: %s', info.messageId);
    // res.status(201).json(`Message send with the id ${info.messageId}`);
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const valideAccount = async (req, res) => {
  try {
    const token = req.params.token;
    const sql = `SELECT * FROM user WHERE activation_token = ?`;
    const values = [token];
    const [result] = await pool.execute(sql, values);
    if (!result) {
      res.status(204).json({ error: 'not valid user' });
      return;
    }
    await pool.execute(
      `UPDATE user SET is_active = 1, activation_token = NULL WHERE activation_token = ?`,
      [token]
    );
    res.status(200).json({ result: 'valide user' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readUser = async (req, res) => {
  try {
    const identifier = req.body.identifier;
    const password = req.body.password;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Some fields are missing' });
      return;
    }

    const sql_verification = `SELECT * FROM user WHERE email = ? OR username = ? AND password = ? AND is_active = true`;
    const values_verification = [identifier, identifier];

    const [resultUser] = await pool.execute(
      sql_verification,
      values_verification
    );
    const isValidPasswod = await bcrypt.compare(
      password,
      resultUser[0].password
    );

    if (!isValidPasswod) {
      res
        .status(401)
        .json({ error: 'Wrong credentials or account not valide' });
      return;
    }
    const getExpirationByRole = () => {
      if (resultUser[0].role_name === 'user') {
        return (getExpirationByRole = { expiresIn: '2h' });
      } else if (resultUser[0].role_name === 'admin') {
        return (getExpirationByRole = { expiresIn: '15m' });
      }
    };

    const token = jwt.sign(
      {
        user_id: resultUser[0].id,
        user_role: resultUser[0].role_name,
      },
      process.env.JWT_PASSWORD
      // getExpirationByRole ///////////////////////////////////////////////////////////////////////////
    );

    res.status(200).json({ result: token });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = {
  createUser,
  valideAccount,
  readUser,
};
