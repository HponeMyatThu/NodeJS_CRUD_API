const crypto = require("crypto");
const requestBodyParser = require("../utils/body-parser");
const writeToFile = require("../utils/write-to-file");

module.exports = async (req, res) => {
  if (req.url === "/api/movies") {
    try {
      let body = await requestBodyParser(req);
      body.id = crypto.randomUUID();
      req.movies.push(body);
      writeToFile(req.movies);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end();
    } catch (err) {
      console.log(err);
      res.writeHead = (400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "CREATE FAILED",
          message: "REQUEST BODY IS NOT VALID",
        })
      );
    }
  } else {
    res.writeHeader(404, { "Content-type": "application/json" });
    res.end(JSON.stringify({ title: "NOT FOUND", message: "ROUTE NOT FOUND" }));
  }
};
