const { AuthService } = require("../services/auth");

exports.signup = async (req, res) => {
  try {
    const newUser = req.body;
    const { user } = await new AuthService().SignUp(newUser);

    res.status(200).send({ message: "User was registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { status, response }= await new AuthService().SignIn({ username, password });

    res.status(status).send(response);
  } catch(error) {
    res.status(500).send({ message: error.message });
  }
};
