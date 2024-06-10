const User = require('../models/User');
const createError = require('http-errors');

const verifyAdmin = async (req, res, next) => {
  const email = req.user?.email;

  if (!email) {
    return next(createError(403, 'Forbidden access'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(403, 'User not found'));
    }

    if (user.role !== 'admin') {
      return next(createError(403, 'Forbidden access'));
    }

    next();
  } catch (error) {
    next(createError(500, 'Server error'));
  }
};

module.exports = verifyAdmin;


