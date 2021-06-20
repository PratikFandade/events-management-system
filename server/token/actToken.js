const jwt = require("jsonwebtoken");

function actToken(req, res, next) {
  const token = req.params.token;
  if (!token) return res.status(400).json("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json("Invalid Token");
  }
}

module.exports = actToken;
