const db = require("../database/models");
const User = db.users;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // Username
    let user = await User.findOne({ where: { username: username } });
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }
    // Email
    user = await User.findOne({ where: { email: email } });
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
    // presence of fields
    if (!username || !password || !email) {
      res.status(400).send({
        message: "Failed! All fields are required!"
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
