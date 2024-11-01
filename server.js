// server.js file
require("dotenv").config();

const express = require("express");
const path = require("path"); // for handling file path
const bodyParser = require("body-parser");

const da = require("./data-access");
const validation = require("./validation");

var portFromCmdLine = process.argv[2];
var apiKeyFromCmdLine = process.argv[3];
var apiKeyFromEnv = process.env.API_KEY;

if (!portFromCmdLine) {
  console.log("run this app with 1 or 2 arguments");
  console.log("node server.js <port> <api-key>");
  console.log("<api-key> is optional");
  process.exit(1);
}

if (!apiKeyFromCmdLine && !apiKeyFromEnv) {
  console.log(
    "No API key has been provided. Please provide a key through the API_KEY env var or the command line"
  );
  process.exit(1);
}
const app = express();
const port = portFromCmdLine;

app.use(bodyParser.json());

//compare API key provided in request header to env variable in dotenv
app.use(validation.apiValidation);

// Set the static directory to serve files from - THIS ISN'T WORKING
//app.use(express.static(path.join(__dirname, "public")));
const staticDir = path.join(__dirname, "public");
// console.log(__dirname);
// console.log(staticDir);
app.use(express.static(staticDir));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/customers", async (req, res) => {
  const [cust, err] = await da.getCustomers();
  if (cust) {
    res.send(cust);
  } else {
    res.status(500).send(err);
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

app.get("/customers/find", async (req, res) => {
  let id = req.query.id;
  let name = req.query.name;
  let email = req.query.email;
  if (!id && !name && !email) {
    res.status(400).send("query string is required");
  } else {
    const [cust, err] = await da.getCustomerQuery(id, name, email);
    if (cust) {
      res.send(cust);
    } else if (err === "no matching customers found") {
      res.status(404).send(err);
    } else {
      res.status(500).send(err);
    }
  }
});

app.get("/customers/:id", async (req, res) => {
  const id = req.params.id;
  const [cust, err] = await da.getCustomerById(id);
  if (cust) {
    res.send(cust);
  } else {
    res.status(404);
    res.send(err);
  }
});

app.put("/customers/:id", async (req, res) => {
  const id = req.params.id;
  const updatedCustomer = req.body;
  if (updatedCustomer === null || req.body == {}) {
    res.status(400);
    res.send("missing request body");
  } else {
    delete updatedCustomer._id;
    // return array format [message, errMessage]
    const [message, errMessage] = await da.updateCustomer(updatedCustomer);
    if (message) {
      res.send(message);
    } else {
      res.status(400);
      res.send(errMessage);
    }
  }
});

app.delete("/customers/:id", async (req, res) => {
  const id = req.params.id;
  // return array [message, errMessage]
  const [message, errMessage] = await da.deleteCustomerByID(id);
  if (message) {
    res.send(message);
  } else {
    res.status(404);
    res.send(errMessage);
  }
});
