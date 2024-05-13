const mysql = require('mysql2/promise');
const process = require('node:process');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  multipleStatements: true,
  //   connectionLimit: 10,
  //   maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  //   idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  //   queueLimit: 0,
  //   enableKeepAlive: true,
  //   keepAliveInitialDelay: 0,
});

module.exports = { pool };
