const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { addDays } = require('date-fns');
const RefreshToken = require('../models/RefreshTokenModel');

router.post('/refresh', async (req, res) => {
  const { token } = req.body;

  try {
    const decode = jwt.verify(token, 'MY_JWT');
    const oldRefreshToken = await RefreshToken.findById(decode._id);

    if (!oldRefreshToken || !oldRefreshToken.isActive) {
      return res.status(400).json({ message: 'Invalid Token' });
    }

    oldRefreshToken.revokedAt = new Date();
    oldRefreshToken.revokedIp = req.clientIp;

    await oldRefreshToken.save();

    //generate new refresh token
    //database object
    const refreshToken = new RefreshToken({
      user: decode.user,
      issuedIp: req.clientIp || 'N/A',
      token: '',
      expiredAt: addDays(new Date(), 30),
    });

    const rToken = jwt.sign(
      {
        _id: refreshToken._id,
        user: decode.user,
        name: decode.name,
        email: decode.email,
      },
      'MY_JWT'
    );

    refreshToken.token = rToken;
    await refreshToken.save();

    const accessToken = jwt.sign(
      { _id: decode.user, name: decode.name, email: decode.email },
      'MY_JWT',
      { expiresIn: '30s' }
    );

    res.status(200).json({ accessToken, refreshToken: rToken });
  } catch (e) {
    console.log(e);
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
