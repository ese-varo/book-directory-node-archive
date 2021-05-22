exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.bookDirectory = (req, res) => {
  res.status(200).send("Book Directory.");
};
