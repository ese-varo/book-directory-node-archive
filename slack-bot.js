const { App } = require("@slack/bolt");
const AddBook = require("./src/slack-bot/modals/AddBook");
const ChangePassword = require("./src/slack-bot/modals/ChangePassword");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN
});

const db = require("./src/models");
const Book = db.books;
const User = db.users;
// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

app.event('member_joined_channel', async ({ event, client, context }) => {
  try {
    const result = await client.chat.postMessage({
      channel: event.channel,
      text: 'hey budy, welcome!'
    });
    resolveUser(client, event.user);
  } catch (error){
    console.error(error);
  }
});

app.command('/add', async ({ ack, payload, client }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: payload.trigger_id,
      view: AddBook
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.command('/credentials', async ({ ack, payload, client }) => {
  await ack();

  try {
    
  } catch (error) {
    console.error(error);
  }
});

app.view('add_book', ({ ack, body, view, context, client }) => {
  ack();

  (async () => {
    try {
      const slackUserId = body['user']['id'];
      const user = await resolveUser(client, slackUserId);

      // WE ONLY CAN RETRIEVE PASSWORDS CREATED BY US, SORRY, TRY GENERATING A NEW ONE FROM WEB

      const userId = user.id;
      const book = {
        title: view['state']['values']['title_input']['title']['value'],
        author: view['state']['values']['author_input']['author']['value'],
        publicationDate: view['state']['values']['date_input']['publication_date']['selected_date'],
        resume: view['state']['values']['abstract_input']['abstract']['value'],
        userId: userId,
      };

      newBook = await Book.create(book);
    } catch (error) {
      console.log(error);
    }
  })();
});

async function resolveUser(client, slackUserId) {
  try {
    const response = await client.users.profile.get({ user: slackUserId });
    const { profile: { email, real_name } } = response;
    let user = await User.findOne({ where: { email: email } });
    if(!user) {
      user = await User.create({
        email,
        username: real_name,
        password: bcrypt.hashSync(slackUserId, 8)
      });
    }
    return user;
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  try {
    const port = 3000;
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  } catch (error) {
      console.log("err");
    console.error(error);
  }
})();

// app.command('/changepass', async ({ ack, payload, client }) => {
//   await ack();

//   try {
//     const result = await client.views.open({
//       trigger_id: payload.trigger_id,
//       view: ChangePassword
//     });
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// });

