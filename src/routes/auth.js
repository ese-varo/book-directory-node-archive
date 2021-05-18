const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/v1/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signup
  );

  app.post("/api/v1/auth/signin", controller.signin);
};
