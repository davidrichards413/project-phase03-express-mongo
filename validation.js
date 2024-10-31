//compare API key provided in request header to env variable in dotenv
function apiValidation(req, res, next) {
  const apiKey = req.get("x-api-key");
  if (typeof apiKey === "undefined") {
    res.status(401).send("API Key is missing");
  } else if (apiKey != process.env.API_KEY) {
    res.status(403).send("API Key is invalid");
  } else {
    next();
  }
}

module.exports = { apiValidation };
