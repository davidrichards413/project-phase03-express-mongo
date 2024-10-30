// server.js file
const express = require("express");
const path = require("path"); // for handling file path
const da = require("./data-access");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 4000; // use env var or default to 4000

app.use(bodyParser.json());

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
  const [cust, err] = await da.getCustomers();
  if (cust) {
    res.send(cust);
  } else {
    res.status(500);
    res.send(err);
  }
});

app.get("/reset", async (req, res) => {
  const [result, err] = await da.resetCustomers();
  if (result) {
    res.send(result);
  } else {
    res.status(500);
    res.send(err);
  }
});

app.post("/customers", async (req, res) => {
  const newCustomer = req.body;
//   console.log(newCustomer);
  if (newCustomer === null || req.body == {}) {
    res.status(400);
    res.send("missing request body");
  } else {
    // return array format [status, id, errMessage]
    const [status, id, errMessage] = await da.addCustomer(newCustomer);
    if (status === "success") {
      res.status(201);
      let response = { ...newCustomer };
      response["_id"] = id;
      res.send(response);
    } else {
      res.status(400);
      res.send(errMessage);
    }
  }
});

app.get("/customers/:id", async (req, res) => {
  const id = req.params.id;
  // return array [customer, errMessage]
  const [cust, err] = await da.getCustomerById(id);
  if (cust) {
    res.send(cust);
  } else {
    res.status(404);
    res.send(err);
  }
});
