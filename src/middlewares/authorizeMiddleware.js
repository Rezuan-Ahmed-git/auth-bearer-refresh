function authorize(roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ message: 'You do not have the permission' });
  };
}

module.exports = authorize;
