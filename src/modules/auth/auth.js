const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
};

const protect = (req, res, next) => {
  const bearer = req.headers.authorization;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  if (!bearer) {
    res.status(401).json({ message: "not authorized" });
    return;
  }

  const [_, token] = bearer.split(" ");
  if (!token) {
    res.status(401).json({ message: "not valid token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    e.type = "auth";
    next(e);
  }
};

module.exports = { createJWT, protect, comparePasswords, hashPassword };
