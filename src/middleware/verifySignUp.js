const db = require("../models");
const User = db.users;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    let user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }
    // Email
    user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }

    next();
  } catch(error) {
    console.error(error);
  }
};

const verifySignUp = { checkDuplicateUsernameOrEmail };

module.exports = verifySignUp;
