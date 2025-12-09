const jwt = require('jsonwebtoken');
const { User } = require('../models');

const jwtSecret = process.env.JWT_SECRET || 'secret_dev';

async function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid Authorization header' });
  const token = parts[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.userId);
    if (!user) return res.status(401).json({ message: 'Invalid token: user not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticate;
