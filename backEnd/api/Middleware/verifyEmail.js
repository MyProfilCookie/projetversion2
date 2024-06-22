const verifyEmail = (req, res, next) => {
    const email = req.headers['email'];
    if (email) {
      req.email = email;
      next();
    } else {
      res.status(403).json({ message: 'Email non valide' });
    }
  };
  module.exports = verifyEmail;