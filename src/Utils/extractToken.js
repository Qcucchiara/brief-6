const jwt = require('jsonwebtoken');

async function extractToken(req) {
  const headerWithToken = req.headers.authorization;
  if (typeof headerWithToken !== undefined || !headerWithToken) {
    const bearer = headerWithToken.split(' ');
    const token = bearer[1];
    const user = jwt.verify(token, process.env.JWT_PASSWORD);

    return user;
  }
  return false;
}

module.exports = { extractToken };
