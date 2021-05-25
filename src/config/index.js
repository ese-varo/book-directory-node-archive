const dotenv = require('dotenv');
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV,
  authSecret: process.env.JWT_SECRET,
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  db: process.env.DB_NAME,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  slack: {
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    botToken: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.APP_TOKEN
  }
}

module.exports = config;
