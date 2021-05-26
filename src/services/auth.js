const db = require("../database/models");
const UserModel = db.users;
const { authSecret } = require("../config");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthService {
  async SignUp(user) {
    try {
      let { password } = user;
      password = bcrypt.hashSync(password, 8);
      const userRecord = await UserModel.create({ ...user, password });

      return { user: userRecord }
    } catch(error) {
      console.error(error);
    }
  }

  async SignIn({ username, password }) {
    try {
      const user = await UserModel.findOne({ where: { username: username } });

      if (!user) {
        return {
          status: 404,
          response: { message: "User Not found." }
        }
      }

      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      if (!passwordIsValid) {
        return {
          status: 401,
          response: {
            accessToken: null,
            message: "Invalid Password!"
          }
        }
      }

      const token = jwt.sign({ id: user.id }, authSecret, {
        expiresIn: 86400 // 24 hours
      });

      return {
        status: 200,
        response: {
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token
        }
      }
    } catch(error) {
      console.error(error);
    }
  }
}

module.exports = { AuthService };
