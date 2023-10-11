const router = require('express').Router();
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshTokenModel');

router.post('/refresh', async (req, res) => {
  const { token } = req.body;

  try {
    const decode = jwt.verify(token, 'MY_JWT');
    const refreshToken = await RefreshToken.findById(decode._id);

    if (!refreshToken || !refreshToken.isActive) {
      return res.status(400).json({ message: 'Invalid Token' });
    }

    const accessToken = jwt.sign(
      { _id: decode.user, name: decode.name, email: decode.email },
      'MY_JWT',
      { expiresIn: '30s' }
    );

    res.status(200).json({ accessToken });
  } catch (e) {
    res.status(400).json({ message: 'Invalid Token' });
  }
});

router.post('/revoke', async (req, res) => {
  const { token } = req.body;

  try {
    const decode = jwt.verify(token, 'MY_JWT');
    const refreshToken = await RefreshToken.findById(decode._id);

    if (!refreshToken || !refreshToken.isActive) {
      return res.status(400).json({ message: 'Invalid Token' });
    }

    refreshToken.revokedAt = new Date();
    refreshToken.revokedIp = req.clientIp;

    await refreshToken.save();

    res.status(200).json({ message: 'Token Revoked' });
  } catch (e) {
    res.status(400).json({ message: 'Invalid Token' });
  }
});

router.post('/valid', async (req, res) => {
  const { token } = req.body;

  try {
    const decode = jwt.verify(token, 'MY_JWT');
    const refreshToken = await RefreshToken.findById(decode._id);

    if (!refreshToken || !refreshToken.isActive) {
      return res.status(400).json({ message: 'Invalid Token' });
    }

    res.status(200).json({ message: 'Token is Valid' });
  } catch (e) {
    res.status(400).json({ message: 'Invalid Token' });
  }
});

module.exports = router;
