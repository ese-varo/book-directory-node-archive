const { App } = require("@slack/bolt");

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
db.sequelize.sync();

// Listen for a slash command invocation
app.command('/add', async ({ ack, payload, client }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: payload.trigger_id,
      // View payload
      view: {
        "type": "modal",
        "callback_id": "add_book",
        "title": {
          "type": "plain_text",
          "text": "Add a new book",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
        },
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "divider"
          },
          {
            "type": "divider"
          },
          {
            "type": "input",
            "block_id": "title_input",
            "element": {
              "type": "plain_text_input",
              "action_id": "title"
            },
            "label": {
              "type": "plain_text",
              "text": "Title",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "author_input",
            "element": {
              "type": "plain_text_input",
              "action_id": "author"
            },
            "label": {
              "type": "plain_text",
              "text": "Author",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "date_input",
            "element": {
              "type": "datepicker",
              "initial_date": "1990-04-28",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a date",
                "emoji": true
              },
              "action_id": "publication_date"
            },
            "label": {
              "type": "plain_text",
              "text": "Publication date",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "abstract_input",
            "element": {
              "type": "plain_text_input",
              "multiline": true,
              "action_id": "abstract"
            },
            "label": {
              "type": "plain_text",
              "text": "Abstract",
              "emoji": true
            }
          }
        ]
      }
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.view('add_book', ({ ack, body, view, context, client }) => {
  ack();

  const title = view['state']['values']['title_input']['title']['value'];
  const author = view['state']['values']['author_input']['author']['value'];
  const date = view['state']['values']['date_input']['publication_date']['value'];
  const resume = view['state']['values']['abstract_input']['abstract']['value'];
  const userId = body['user']['id']['value'];
  const book = {
    title: title,
    author: author,
    resume: resume,
    publicationDate: date,
    userId: 2
  };

  let email = '';
  (async () => {
    try {
      email = await client.users.profile.get({ user: userId });
      console.log(email.profile.email);
      newBook = await Book.create(book);
    } catch (error) {
      console.log(error);
    }
  })();

  // You'll probably want to store these values somewhere
  console.log(title);
  console.log(author);
  console.log(date);
  console.log(resume);
  console.log("user id: " + userId);
});

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
