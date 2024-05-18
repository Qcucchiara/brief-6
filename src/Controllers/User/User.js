const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool } = require('../../Services/mysql');
const { transporter } = require('../../Services/mailer');
const { createFollowTable } = require('./UserFollows');
const client = require('../../Services/mongodb');

const createUser = async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const imageName = req.file.filename;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role; // a changer
    const isActive = false;
    const gdpr = () => {
      if (req.body.gdpr === 'true') {
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
      res.status(400).json({
        error: 'invalid credentials (mail  or username already used)',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = await bcrypt.hash(email, 10);
    const cleanToken = activationToken.replaceAll('/', '');

    const sqlUser = `INSERT INTO user VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const valuesUser = [
      firstName,
      lastName,
      username,
      imageName,
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
    // res.status(201).json({ result: resultUser });

    const info = await transporter.sendMail({
      from: `${process.env.SMTP_EMAIL}`,
      to: email,
      subject: 'activation brief-6 ✔',
      text: 'activate your email',
      html: `<b>click here to <a href = "http://localhost:3000/api/guest/valide/${cleanToken}">activate your account</a></b>`,
    });
    console.log('Message sent: %s', info.messageId);
    res.status(201).json(`Message send with the id ${info.messageId}`);
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const valideAccount = async (req, res) => {
  try {
    const token = req.params.userToken;
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
    await createFollowTable(req, result[0].id);
    res.status(200).json({ result: 'valide user' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const login = async (req, res) => {
  try {
    const identifier = req.body.identifier;
    const password = req.body.password;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Some fields are missing' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql_verification = `SELECT * FROM user WHERE email = ? OR username = ? AND password = ? AND is_active = true`;
    const values_verification = [identifier, identifier, hashedPassword];

    const [resultUser] = await pool.execute(
      sql_verification,
      values_verification
    );

    const tableFollow = await client
      .db('Brief-6')
      .collection('Follows')
      .findOne({ userId: resultUser[0].id });
    console.log(tableFollow);
    console.log(resultUser[0].id);

    const isValidPasswod = await bcrypt.compare(
      password,
      resultUser[0].password
    );

    if (!isValidPasswod) {
      res.status(401).json({ error: 'Wrong credentials or account not valid' });
      return;
    }
    /** a n'utiliser qu'à la fin */
    const getExpirationByRole = () => {
      if (resultUser[0].role_name === 'user') {
        return (getExpirationByRole = { expiresIn: '2h' });
      } else if (resultUser[0].role_name === 'admin') {
        return (getExpirationByRole = { expiresIn: '15m' });
      }
    };

    const token = jwt.sign(
      {
        userId: resultUser[0].id,
        tableFollowId: tableFollow._id + '',
        role: resultUser[0].role,
      },
      process.env.JWT_PASSWORD
      // getExpirationByRole()
    );

    res.status(200).json({ result: token });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readAllUser = async (req, res) => {
  try {
  } catch (error) {}
};

const editUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;

    const userIsValide = await pool.execute(
      `SELECT * FROM user WHERE email = ? AND username = ?`,
      [email, username]
    );

    if (!userIsValide) {
      res.status(400).json({ error: 'wrong credentials' });
      return;
    }

    const activationToken = await bcrypt.hash(email, 10);
    const cleanToken = activationToken.replaceAll('/', '');

    await pool.execute(`UPDATE user SET activation_token = ? WHERE email = ?`, [
      cleanToken,
      email,
    ]);

    const info = await transporter.sendMail({
      from: `${process.env.SMTP_EMAIL}`,
      to: email,
      subject: 'reset password brief-6 ✔',
      text: 'reset password',
      html: `<b>click here to <a href = "http://localhost:3000/api/guest/changepassword/${cleanToken}">reset your password</a></b>`,
    });
    console.log('Message sent: %s', info.messageId);
    res.status(201).json(`Message send with the id ${info.messageId}`);
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const changePassword = async (req, res) => {
  try {
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const token = req.params.token;

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: 'passwords are not identical' });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.execute(
      `UPDATE user SET activation_token = NULL, password = ? WHERE activation_token = ?`,
      [hashedPassword, token]
    );
    res.status(200).json({ result: 'password changed' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = {
  createUser,
  valideAccount,
  login,
  resetPassword,
  changePassword,
};
