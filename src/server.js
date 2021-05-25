const http = require('http');
const app = require('./app');

// set port, listen for requests
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

