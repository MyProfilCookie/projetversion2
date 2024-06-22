const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const options = {
    expiresIn: '1h', // Le token expirera dans 1 heure
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);


};

const user = { id: '123', email: 'test@example.com' };
const token = generateToken(user);
console.log('Generated JWT:', token);