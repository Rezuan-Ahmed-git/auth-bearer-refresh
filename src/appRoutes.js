const router = require('express').Router();
const authenticate = require('./authenticateMiddleware');

router.get('/public', (req, res) => {
  res.status(200).json({ message: 'I am public' });
});

router.get('/private', authenticate, (req, res) => {
  res.status(200).json({ message: 'I am PRIVATE' });
});

module.exports = router;
