const { App } = require("@slack/bolt");
const AddBook = require("./slack-bot/modals/AddBook");
const bcrypt = require("bcryptjs");
const { slack: {
  botToken,
  signinSecret,
  appToken
} } = require("./config");

require("dotenv").config();

const app = new App({
  token: botToken,
  signingSecret: signingSecret,
  socketMode: true,
  appToken: appToken
});

const db = require("./models");
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
    console.log(event.user);
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
    const { user_id, user_name } = payload;
    let answer = `Save your credentials in a safe place\n\n *Username:* ${user_name} \n\n *Password:* ${user_id}`;
    const user = await resolveUser(client, user_id);
    if(!user) {
      answer = "You don't have an account yet!";
    } else {
      const passwordIsValid = bcrypt.compareSync(
        user_id,
        user.password
      );
      if(!passwordIsValid) answer = "Sorry this time we cannot help!\n\nTry recovering the password from the browser :cry:";
    }

    const result = await client.views.open({
      trigger_id: payload.trigger_id,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "Your Credentials",
          emoji: true
        },
        close: {
          type: "plain_text",
          text: "Close",
          emoji: true
        },
        blocks: [
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: answer
             }
          }
        ]
      }
    });
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

      const userId = user.id;
      const book = {
        title: view['state']['values']['title_input']['title']['value'],
        author: view['state']['values']['author_input']['author']['value'],
        publicationDate: view['state']['values']['date_input']['publication_date']['selected_date'],
        resume: view['state']['values']['abstract_input']['abstract']['value'],
        userId: userId,
      };

      newBook = await Book.create(book);
      await client.chat.postMessage({
        channel: 'C022L77459T',
        text: "You've added a new book! :smiley:"
      });
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

