const router = require('express').Router();
const authenticate = require('../middlewares/authenticateMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');

router.get(
  '/public',
  authenticate,
  authorize(['admin', 'user']),
  (_req, res) => {
    res.status(200).json({ message: 'I am public' });
  }
);

router.get('/private', authenticate, authorize(['admin']), (_req, res) => {
  res.status(200).json({ message: 'I am PRIVATE' });
});

module.exports = router;
