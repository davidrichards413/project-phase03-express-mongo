// data-access.js file
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const dbName = process.env.MONGO_DBNAME;
const baseUrl = process.env.MONGO_URL;
const connectString = baseUrl + "/" + dbName;
const collectionName = "customers";
let collection;

async function dbStartup() {
  const client = new MongoClient(connectString);
  await client.connect();
  collection = client.db(dbName).collection(collectionName);
}

async function getCustomers() {
  try {
    let customers = await collection.find().toArray();
    return [customers, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

async function resetCustomers() {
  let data = [
    { id: 0, name: "Mary Jackson", email: "maryj@abc.com", password: "maryj" },
    {
      id: 1,
      name: "Karen Addams",
      email: "karena@abc.com",
      password: "karena",
    },
    {
      id: 2,
      name: "Scott Ramsey",
      email: "scottr@abc.com",
      password: "scottr",
    },
  ];
  try {
    await collection.deleteMany({});
    await collection.insertMany(data);
    const customers = await collection.find().toArray();
    const message =
      "data was refreshed. There are now " +
      customers.length +
      " customer records!";
    return [message, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

async function addCustomer(newCustomer) {
  try {
    const insertResult = await collection.insertOne(newCustomer);
    return ["success", insertResult.insertedId, null];
  } catch (err) {
    console.log(err.message);
    return ["fail", null, err.message];
  }
}

async function getCustomerById(id) {
  try {
    const customer = await collection.findOne({ id: +id });
    // return array [customer, errMessage]
    if (!customer) {
      return [null, "invalid customer number"];
    }
    return [customer, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}
async function getCustomerQuery(id, name, email) {
  let query;
  if (id) {
    query = { id: +id };
  }
  if (name) {
    query = { name: name };
  }
  if (email) {
    query = { email: email };
  }
  // console.log(query);
  try {
    const customer = await collection.find(query).toArray();
    // return array [customer, errMessage]
    if (customer.length === 0) {
      return [null, "no matching customers found"];
    }
    if (!customer) {
      return [null, "invalid query"];
    }
    return [customer, null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

async function updateCustomer(updatedCustomer) {
  try {
    const filter = { id: updatedCustomer.id };
    const setData = { $set: updatedCustomer };
    const updateResult = await collection.updateOne(filter, setData);
    // return array [message, errMessage]
    return ["one record updated", null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

async function deleteCustomerByID(id) {
  try {
    const filter = { id: +id };
    const deleteResult = await collection.deleteOne(filter);
    if (deleteResult.deletedCount === 0) {
      // return array [message, errMessage]
      return [null, "no record deleted"];
    } else if (deleteResult.deletedCount === 1) {
      return ["one record deleted", null];
    } else {
      return [null, "error deleting records"];
    }
    return ["one record deleted", null];
  } catch (err) {
    console.log(err.message);
    return [null, err.message];
  }
}

dbStartup();
module.exports = {
  getCustomers,
  resetCustomers,
  addCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomerByID,
  getCustomerQuery,
};
