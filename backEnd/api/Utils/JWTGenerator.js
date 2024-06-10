const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
 function JWTGenerator(payload) {
    const token = jwt.sign(payload, process.env.JW_SECRET, {
        expiresIn: maxAge,
    });
    return token;
}

module.exports = JWTGenerator;