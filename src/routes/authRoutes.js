const router = require('express').Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { addDays } = require('date-fns');
const RefreshToken = require('../models/RefreshTokenModel');

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  user = new User({
    name,
    email,
    password: hash,
    role,
  });

  await user.save();

  res.status(201).json(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    'MY_JWT',
    { expiresIn: '30s' }
  );

  //database object
  const refreshToken = new RefreshToken({
    user: user._id,
    issuedIp: req.clientIp || 'N/A',
    token: '',
    expiredAt: addDays(new Date(), 30),
  });

  const rToken = jwt.sign(
    {
      _id: refreshToken._id,
      user: user._id,
      name: user.name,
      email: user.email,
    },
    'MY_JWT'
  );

  refreshToken.token = rToken;
  await refreshToken.save();

  res.status(200).json({ accessToken: token, refreshToken: rToken });
});

module.exports = router;
