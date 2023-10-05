const jwt = require('jsonwebtoken');
const User = require('./UserModel');

async function authenticate(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  try {
    token = token.split(' ')[1];
    const decode = jwt.verify(token, 'MY_JWT');

    const user = await User.findById(decode._id).select('-password');
    req.user = user;

    next();
  } catch (e) {
    return res.status(400).json({ message: 'Invalid token' });
  }
}

module.exports = authenticate;
