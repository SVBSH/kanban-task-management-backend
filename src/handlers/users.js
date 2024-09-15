const { validationResult } = require("express-validator");
const { User } = require("../models");
const {
  hashPassword,
  createJWT,
  comparePasswords,
} = require("../modules/auth/auth");
const { ValidationError } = require("sequelize");

const createNewUser = async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await User.create({
      username: username,
      password: hashedPassword,
    });
    const token = createJWT(user);
    res.json({ token });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: `user ${username} already exist` });
    } else {
      return res.status(400).json({ error: error.message });
    }
  }
};

const signin = async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const user = await User.findOne({
    attributes: ["username", "password", "id"],
    where: {
      username: username,
    },
  });

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) {
    res.status(401).json({ message: "not authorized" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};

module.exports = { createNewUser, signin };
