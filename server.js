// server.js file
const express = require("express");
const path = require("path"); // for handling file path

const app = express();
const port = process.env.PORT || 4000; // use env var or default to 4000

// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
