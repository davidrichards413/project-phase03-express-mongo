// server.js file
const express = require("express");
const path = require("path"); // for handling file path
const da = require("./data-access");

const app = express();
const port = process.env.PORT || 4000; // use env var or default to 4000

// Set the static directory to serve files from
//app.use(express.static(path.join(__dirname, "public")));
// Set the static directory to serve files from
const staticDir = path.join(__dirname, "public");
console.log(__dirname);
console.log(staticDir);
app.use(express.static(staticDir));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/customers", async (req, res) => {
  const cust = await da.getCustomers();
  res.send(cust);
});
