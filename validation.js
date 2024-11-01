//compare API key provided in request header to env variable in dotenv
function apiValidation(req, res, next) {
  const { env } = require("process");
  
  const userApiKey = process.argv[3] || process.env.API_KEY;
  // console.log(`User API Key = ${userApiKey}`);

  const endpointApiKey = req.get("x-api-key");
  // console.log(`Endpoint API Key = ${endpointApiKey}`);

  if (typeof endpointApiKey === "undefined") {
    res.status(401).send("Endpoint API Key is missing");
  } else if (typeof userApiKey === "undefined") {
    res.status(401).send("User API Key is missing");
  } else if (endpointApiKey != userApiKey) {
    res.status(403).send("API Key is invalid");
  } else {
    next();
  }
}

module.exports = { apiValidation };
