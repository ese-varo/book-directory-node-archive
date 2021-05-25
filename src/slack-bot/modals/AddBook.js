const AddBook = {
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
          "action_id": "title",
          "placeholder": {
            "type": "plain_text",
            "text": "title",
          }
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
          "action_id": "author",
          "placeholder": {
            "type": "plain_text",
            "text": "author",
          }
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
          "action_id": "abstract",
          "placeholder": {
            "type": "plain_text",
            "text": "abstract"
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Abstract",
          "emoji": true
        }
      }
    ]
}

module.exports = AddBook;
